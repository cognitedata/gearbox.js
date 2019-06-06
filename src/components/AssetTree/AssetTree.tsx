import { Asset, AssetListDescendantsParams } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeProps } from 'antd/lib/tree';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  AssetTreeProps,
  OnSelectAssetTreeParams,
  TreeNodeData,
  TreeNodeType,
} from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';

const { TreeNode } = Tree;

interface ExpandedKeysMap {
  [key: number]: true;
}

interface AssetTreeState {
  assets: Asset[];
  treeData: TreeNodeData[];
  expandedKeys: ExpandedKeysMap;
}

const cursorApiRequest = async (
  assetId: number,
  params: AssetListDescendantsParams,
  data: Asset[] = []
): Promise<Asset[]> => {
  const result = await sdk.Assets.listDescendants(assetId, params);
  const { nextCursor: cursor } = result;
  if (result.nextCursor) {
    return cursorApiRequest(assetId, { ...params, cursor }, [
      ...data,
      ...result.items,
    ]);
  }
  return [...data, ...result.items];
};

export class AssetTree extends Component<AssetTreeProps, AssetTreeState> {
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

  static toKeys(path: number[], initial = {}): ExpandedKeysMap {
    return path.reduce((acc, i) => ({ ...acc, [i]: true }), initial);
  }

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
    const assets = await sdk.Assets.list({ depth: 1 });
    this.setState({
      assets: assets.items,
      treeData:
        assets && assets.items.length > 0
          ? AssetTree.mapDataAssets(assets.items)
          : [],
    });
  }

  onLoadData = async (treeNode: AntTreeNode) => {
    if (treeNode.props.children) {
      return;
    }
    const eventKey = treeNode.props.eventKey;
    const assetId = eventKey ? Number.parseInt(eventKey, 10) : undefined;

    if (assetId && !Number.isNaN(assetId)) {
      const query = {
        depth: 2,
        limit: 1000,
      };

      const loadedData = await cursorApiRequest(assetId, query);
      if (loadedData.length > 1) {
        treeNode.props.dataRef.children = loadedData
          .slice(1)
          // @ts-ignore
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
  font-family: ${({ theme }) => theme.gearbox.textFamily};
  font-size: ${({ theme }) => theme.gearbox.textSize};
  color: ${({ theme }) => theme.gearbox.listColor};
`;

TreeNodeWrapper.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};
