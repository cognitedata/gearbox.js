import { Asset, CogniteClient } from '@cognite/sdk';
import { Spin, Tree } from 'antd';
import { AntTreeNode, AntTreeNodeProps } from 'antd/lib/tree';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { defaultTheme } from '../../theme/defaultTheme';
import {
  applyThemeFontFamily,
  applyThemeFontSize,
  applyThemeListHighlight,
} from '../../utils/theme';
import { AssetTreeProps } from './interfaces';

const { TreeNode } = Tree;

interface ExpandedKeysMap {
  [key: number]: true;
}

interface AssetTreeNodeMap {
  [id: string]: AssetTreeNode;
}

interface AssetTreeState {
  loading: boolean;
  loadedKeys: string[];
  rootAssetNodes: number[];
  assetNodesMap: AssetTreeNodeMap;
  expandedKeys: ExpandedKeysMap;
}

interface AutoPagingToArrayOptions {
  limit?: number;
}

interface AssetTreeNode {
  asset: Asset;
  children?: number[];
  isLeaf: boolean;
}

class AssetTree extends Component<AssetTreeProps, AssetTreeState> {
  static contextType = ClientSDKProxyContext;
  static defaultProps = {
    theme: { ...defaultTheme },
  };

  static convertAssetsToNodeMap(assets: Asset[]): AssetTreeNodeMap {
    const nodes: AssetTreeNodeMap = {};
    assets.map(AssetTree.convertToNode).forEach(node => {
      nodes[node.asset.id] = node;
    });
    return nodes;
  }

  static convertToNode(asset: Asset): AssetTreeNode {
    const isLeaf = asset.aggregates ? !asset.aggregates.childCount : false;
    return { asset, isLeaf };
  }
  // TODO path?
  static toKeys(path: number[], initial = {}): ExpandedKeysMap {
    return path.reduce((acc, i) => ({ ...acc, [i]: true }), initial);
  }
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  autoPagingToArrayOptions: AutoPagingToArrayOptions = this.props
    .autoPagingToArrayOptions
    ? this.props.autoPagingToArrayOptions
    : { limit: Infinity };

  constructor(props: AssetTreeProps) {
    super(props);
    const { defaultExpandedKeys } = props;
    this.state = {
      loadedKeys: [],
      loading: true,
      rootAssetNodes: [],
      assetNodesMap: {},
      expandedKeys: AssetTree.toKeys(defaultExpandedKeys || []),
    };
  }

  async componentDidMount() {
    this.loadAssetInfo();
  }

  componentDidUpdate(prevProps: AssetTreeProps) {
    if (!isEqual(prevProps.assetIds, this.props.assetIds)) {
      this.resetExpandedKeys();
      this.loadAssetInfo();
    }
  }

  loadAssetInfo = async () => {
    this.client = this.context(AssetTreeWithTheme.displayName || '')!;
    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    this.setState({ loading: true }, async () => {
      const { assetIds } = this.props;
      let assets: Asset[] = [];
      if (assetIds) {
        if (assetIds.length > 0) {
          assets = await this.client.assets.retrieve(
            assetIds.map(id => ({ id }))
          );
        }
      } else {
        assets = await this.client.assets
          .list({
            filter: { root: true },
            aggregatedProperties: ['childCount'],
          })
          .autoPagingToArray(this.autoPagingToArrayOptions);
      }

      const assetNodesMap = AssetTree.convertAssetsToNodeMap(assets);
      const rootAssetNodes = Object.keys(assetNodesMap).map(Number);

      this.setState({
        rootAssetNodes,
        assetNodesMap,
        loading: false,
      });
    });
  };

  cursorApiRequest = async (assetId: number): Promise<Asset[]> => {
    const result = await this.client.assets
      .list({
        filter: { parentIds: [assetId] },
        aggregatedProperties: ['childCount'],
      })
      .autoPagingToArray(this.autoPagingToArrayOptions);
    if (!result || !Array.isArray(result)) {
      console.error(ERROR_API_UNEXPECTED_RESULTS);
    }
    return result;
  };

  onLoadData = async (treeNode: AntTreeNode) => {
    const eventKey = treeNode.props.eventKey;
    const assetId = eventKey ? Number.parseInt(eventKey, 10) : undefined;
    const { loadedKeys } = this.state;
    const updatedLoadedKeys =
      eventKey && !loadedKeys.includes(eventKey)
        ? [...loadedKeys, eventKey]
        : loadedKeys;

    if (!treeNode.props.children && assetId) {
      const updatedAssetNode = { ...this.state.assetNodesMap[assetId] };
      const assetChildren = await this.cursorApiRequest(assetId);
      const mapUpdate = AssetTree.convertAssetsToNodeMap(assetChildren);

      if (assetChildren.length) {
        assetChildren.sort((a, b) => a.name.localeCompare(b.name));
        updatedAssetNode.children = assetChildren.map(({ id }) => id);
      } else {
        updatedAssetNode.isLeaf = true;
      }

      this.setState(state => ({
        assetNodesMap: {
          ...state.assetNodesMap,
          [assetId]: updatedAssetNode,
          ...mapUpdate,
        },
        loadedKeys: [...updatedLoadedKeys],
      }));
    }
  };

  onSelectNode = (title: string, key?: string) => {
    const assetId = Number.parseInt(key || '', 10);
    const { asset: node, isLeaf } = this.state.assetNodesMap[assetId];
    const { onSelect } = this.props;
    if (onSelect && key) {
      onSelect({ node, key, isLeaf, title });
    }
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: AssetTree.toKeys(
        expandedKeys.map(key => Number.parseInt(key, 10))
      ),
    });
  };

  renderTreeNode = (nodeIds: number[]) => {
    const { styles } = this.props;
    return nodeIds.map(assetId => {
      const node = this.state.assetNodesMap[assetId];
      const { children, asset, isLeaf } = node;
      return (
        node && (
          <TreeNodeWrapper
            title={this.getDisplayName(asset)}
            key={asset.id}
            isLeaf={isLeaf}
            style={styles && styles.list}
          >
            {children && this.renderTreeNode(children)}
          </TreeNodeWrapper>
        )
      );
    });
  };

  resetExpandedKeys = () => {
    this.setState({ expandedKeys: {}, loadedKeys: [] });
  };

  render() {
    const { showLoading } = this.props;
    const { rootAssetNodes, expandedKeys, loading, loadedKeys } = this.state;
    const { onLoadData, onSelectNode, renderTreeNode, onExpand } = this;
    if (showLoading && loading) {
      return <Spin />;
    }
    return (
      <Tree
        loadedKeys={loadedKeys}
        loadData={onLoadData}
        onSelect={(_, e) =>
          onSelectNode(e.node.props.title as string, e.node.props.eventKey)
        }
        expandedKeys={Object.keys(expandedKeys)}
        onExpand={onExpand}
      >
        {renderTreeNode(rootAssetNodes)}
      </Tree>
    );
  }

  private getDisplayName = (asset: Asset) => {
    const { displayName } = this.props;
    if (displayName) {
      return displayName(asset);
    }
    return `${asset.name}${asset.description ? ': ' + asset.description : ''}`;
  };
}

const TreeNodeWrapper = styled(TreeNode)<AntTreeNodeProps>`
  ${({ theme }) => applyThemeFontFamily(theme.gearbox)}
  ${({ theme }) => applyThemeFontSize(theme.gearbox)}
  & span {
    color: ${({ theme }) => theme.gearbox.textColor};
  }
  & .ant-tree-node-selected {
    ${({ theme }) => applyThemeListHighlight(theme.gearbox)}
  }
`;

const AssetTreeWithTheme = withDefaultTheme(AssetTree);
AssetTreeWithTheme.displayName = 'AssetTree';

export { AssetTreeWithTheme as AssetTree };
export { AssetTree as AssetTreeWithoutTheme };
