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
import {
  AssetTreeProps,
  OnSelectAssetTreeParams,
  TreeNodeData,
  TreeNodeType,
} from '../../interfaces';
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

interface AssetTreeState {
  assets: Asset[];
  treeData: TreeNodeData[];
  expandedKeys: ExpandedKeysMap;
}

interface AutoPagingToArrayOptions {
  limit?: number;
}

class AssetTree extends React.Component<AssetTreeProps, AssetTreeState> {
  static contextType = ClientSDKContext;
  static defaultProps = {
    theme: { ...defaultTheme },
  };
  static mapDataAssets(assets: Asset[]): TreeNodeData[] {
    const nodes: { [name: string]: TreeNodeData } = {};

    assets.forEach(asset => {
      nodes[asset.id] = AssetTree.returnPretty(asset);
    });

    const addedAsChildren: (number | string)[] = [];

    assets.forEach(asset => {
      const { parentId } = asset;
      const node = nodes[parentId as number]; // casting is not a problem. It will return undefined if not found
      if (!node) {
        return;
      }
      if (node.children) {
        node.children.push(nodes[asset.id]);
      } else {
        node.children = [nodes[asset.id]];
      }
      addedAsChildren.push(asset.id);
      node.isLeaf = false;
    });

    addedAsChildren.forEach(id => {
      delete nodes[id];
    });

    return Object.keys(nodes).map(id => {
      return nodes[id];
    });
  }

  static returnPretty(asset: Asset) {
    return {
      title: `${asset.name}: ${asset.description}`,
      key: asset.id,
      node: asset,
      isLeaf: true,
    };
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
      assets: [],
      treeData: [],
      expandedKeys: defaultExpandedKeys
        ? AssetTree.toKeys(defaultExpandedKeys)
        : {},
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
    this.setState({
      assets,
      treeData:
        assets && assets.length > 0 ? AssetTree.mapDataAssets(assets) : [],
    });
  }

  cursorApiRequest = async (assetId: number): Promise<Asset[]> => {
    const result = await this.context!.assets.list({
      filter: { parentIds: [assetId] },
    }).autoPagingToArray(this.autoPagingToArrayOptions);
    if (!result || !Array.isArray(result)) {
      console.error(ERROR_API_UNEXPECTED_RESULTS);
    }
    return result;
  };

  onLoadData = async (treeNode: AntTreeNode) => {
    if (treeNode.props.children) {
      return;
    }
    const eventKey = treeNode.props.eventKey;
    const assetId = eventKey ? Number.parseInt(eventKey, 10) : undefined;

    if (assetId && !Number.isNaN(assetId)) {
      const loadedData = await this.cursorApiRequest(assetId);
      if (loadedData.length > 0) {
        treeNode.props.dataRef.children = [...loadedData]
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(x => x.parentId && x.parentId === treeNode.props.dataRef.key)
          .map(x => ({
            title: `${x.name} ${x.description ? ':' : ''} ${x.description ||
              ''}`,
            key: x.id,
            node: x,
            isLeaf: loadedData.filter(y => y.parentId === x.id).length <= 0,
          }));

        this.setState({
          treeData: [...this.state.treeData],
        });
      } else {
        treeNode.props.dataRef.isLeaf = true;
      }
    }
  };

  onSelectNode = (returnAsset: OnSelectAssetTreeParams) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(returnAsset);
    }
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: AssetTree.toKeys(
        expandedKeys.map(key => Number.parseInt(key, 10))
      ),
    });
  };

  renderTreeNode = (nodes: TreeNodeType[]) => {
    const { styles } = this.props;
    return nodes.map(item => {
      if (item.children) {
        return (
          <TreeNodeWrapper
            title={item.title}
            key={item.key}
            dataRef={item}
            style={styles && styles.list}
          >
            {this.renderTreeNode(item.children)}
          </TreeNodeWrapper>
        );
      }
      return (
        <TreeNodeWrapper
          title={item.title}
          key={item.key}
          dataRef={item}
          style={styles && styles.list}
        />
      );
    });
  };

  render() {
    const { treeData, expandedKeys } = this.state;
    return (
      <Tree
        loadData={this.onLoadData}
        onSelect={(_, e) => this.onSelectNode(e.node.props.dataRef)}
        expandedKeys={Object.keys(expandedKeys)}
        onExpand={this.onExpand}
      >
        {this.renderTreeNode(treeData)}
      </Tree>
    );
  }
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
