import { Asset } from '@cognite/sdk';
import { Tree } from 'antd';
import { AntTreeNode } from 'antd/lib/tree';
import React, { Component } from 'react';
import {
  AssetTreeType,
  OnSelectReturnType,
  TreeNodeData,
  TreeNodeType,
} from '../../interfaces';

const { TreeNode } = Tree;

interface ExpandedKeysMap {
  [key: string]: true;
}

interface AssetTreeState {
  assets?: Asset[]; // reference to assets in props
  treeData: TreeNodeData[];
  expandedKeys: ExpandedKeysMap;
}

export class AssetTree extends Component<AssetTreeType, AssetTreeState> {
  static getDerivedStateFromProps(props: AssetTreeType, state: AssetTreeState) {
    if (props.assets !== state.assets) {
      return AssetTree.getStateFromProps(props);
    } else {
      return null;
    }
  }

  static getStateFromProps(props: AssetTreeType): AssetTreeState {
    const { assets, defaultExpandedKeys } = props;
    return {
      assets,
      treeData:
        assets && assets.length > 0 ? AssetTree.mapDataAssets(assets) : [],
      expandedKeys: defaultExpandedKeys ? this.toKeys(defaultExpandedKeys) : {},
    };
  }

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

  static toKeys(path: string[], initial = {}): ExpandedKeysMap {
    return path.reduce((acc, i) => ({ ...acc, [i]: true }), initial);
  }

  constructor(props: AssetTreeType) {
    super(props);
    this.state = AssetTree.getStateFromProps(props);
  }

  onLoadData = async (treeNode: AntTreeNode) => {
    const { loadData } = this.props;

    if (treeNode.props.children) {
      return;
    }
    const eventKey = treeNode.props.eventKey;
    const assetId = eventKey ? Number.parseInt(eventKey, 10) : undefined;

    if (loadData && assetId && !Number.isNaN(assetId)) {
      const query = {
        depth: 2,
        limit: 1000,
      };

      const loadedData = loadData(assetId, query);
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

  onSelectNode = (returnAsset: OnSelectReturnType) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(returnAsset);
    }
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: AssetTree.toKeys(expandedKeys),
    });
  };

  renderTreeNode = (nodes: TreeNodeType[]) =>
    nodes.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} dataRef={item} />;
    });

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
