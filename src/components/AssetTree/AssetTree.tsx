import { Asset } from '@cognite/sdk';
import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeProps } from 'antd/lib/tree';
import React from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { AssetTreeProps } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';
import {
  applyThemeFontFamily,
  applyThemeFontSize,
  applyThemeListHighlight,
} from '../../utils/theme';

const { TreeNode } = Tree;

interface ExpandedKeysMap {
  [key: number]: true;
}

interface AssetTreeNodeMap {
  [id: string]: AssetTreeNode;
}

interface AssetTreeState {
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

class AssetTree extends React.Component<AssetTreeProps, AssetTreeState> {
  static contextType = ClientSDKContext;
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
  context!: React.ContextType<typeof ClientSDKContext>;

  autoPagingToArrayOptions: AutoPagingToArrayOptions = this.props
    .autoPagingToArrayOptions
    ? this.props.autoPagingToArrayOptions
    : { limit: 25 };

  constructor(props: AssetTreeProps) {
    super(props);
    const { defaultExpandedKeys } = props;
    this.state = {
      rootAssetNodes: [],
      assetNodesMap: {},
      expandedKeys: AssetTree.toKeys(defaultExpandedKeys || []),
    };
  }

  async componentDidMount() {
    if (!this.context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    const assets = await this.context.assets
      .list({ filter: { root: true } })
      .autoPagingToArray(this.autoPagingToArrayOptions);

    const assetNodesMap = AssetTree.convertAssetsToNodeMap(assets);
    const rootAssetNodes = Object.keys(assetNodesMap).map(Number);

    this.setState({
      rootAssetNodes,
      assetNodesMap,
    });
  }

  cursorApiRequest = async (assetId: number): Promise<Asset[]> => {
    const result = await this.context!.assets.list({
      filter: { parentIds: [assetId] },
      aggregatedProperties: ['childCount'],
    }).autoPagingToArray(this.autoPagingToArrayOptions);
    if (!result || !Array.isArray(result)) {
      console.error(ERROR_API_UNEXPECTED_RESULTS);
    }
    return result;
  };

  onLoadData = async (treeNode: AntTreeNode) => {
    const eventKey = treeNode.props.eventKey;
    const assetId = eventKey ? Number.parseInt(eventKey, 10) : undefined;
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
            children={children && this.renderTreeNode(children)}
          />
        )
      );
    });
  };

  render() {
    const { rootAssetNodes, expandedKeys } = this.state;
    const { onLoadData, onSelectNode, renderTreeNode, onExpand } = this;
    return (
      <Tree
        loadData={onLoadData}
        onSelect={(_, e) =>
          onSelectNode(e.node.props.title as string, e.node.props.eventKey)
        }
        expandedKeys={Object.keys(expandedKeys)}
        onExpand={onExpand}
        children={renderTreeNode(rootAssetNodes)}
      />
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

const Component = withDefaultTheme(AssetTree);
Component.displayName = 'AssetTree';

export { Component as AssetTree };
