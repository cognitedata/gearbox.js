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
import { AssetTreeProps, OnSelectAssetTreeParams } from '../../interfaces';
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
  treeData: AssetTreeNode[];
  expandedKeys: ExpandedKeysMap;
}

interface AutoPagingToArrayOptions {
  limit?: number;
}

interface AssetTreeNode {
  asset: Asset;
  children?: AssetTreeNode[];
  isLeaf: boolean;
}

class AssetTree extends React.Component<AssetTreeProps, AssetTreeState> {
  static contextType = ClientSDKContext;
  static defaultProps = {
    theme: { ...defaultTheme },
  };

  static mapDataAssets(assets: Asset[]): AssetTreeNode[] {
    const nodes: { [id: string]: AssetTreeNode } = {};

    assets.forEach(asset => {
      nodes[asset.id] = AssetTree.convertToNode(asset);
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

  static convertToNode(asset: Asset): AssetTreeNode {
    return {
      asset,
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
    if (!(assetId && !Number.isNaN(assetId))) {
      return;
    }

    const cdfAssetChildren = await this.cursorApiRequest(assetId);
    if (cdfAssetChildren.length > 0) {
      treeNode.props.dataRef.children = [...cdfAssetChildren]
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(
          asset =>
            asset.parentId && asset.parentId === treeNode.props.dataRef.asset.id
        )
        .map(asset => AssetTree.convertToNode(asset));
      this.setState({
        treeData: [...this.state.treeData],
      });
    } else {
      treeNode.props.dataRef.isLeaf = true;
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

  renderTreeNode = (nodes: AssetTreeNode[]) => {
    const { styles } = this.props;
    return nodes.map(item => {
      if (item.children) {
        return (
          <TreeNodeWrapper
            title={this.getDisplayName(item.asset)}
            key={item.asset.id}
            dataRef={item}
            style={styles && styles.list}
          >
            {this.renderTreeNode(item.children)}
          </TreeNodeWrapper>
        );
      }
      return (
        <TreeNodeWrapper
          title={this.getDisplayName(item.asset)}
          key={item.asset.id}
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
