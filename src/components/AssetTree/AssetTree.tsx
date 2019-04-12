import React, { Component } from 'react';
import { Tree } from 'antd';
import { AntTreeNode } from 'antd/lib/tree';
import {
  AssetTreeType,
  TreeNodeType,
  VAsset,
  OnSelectReturnType,
  TreeNodeData,
} from 'utils/validators';

const { TreeNode } = Tree;

class AssetTree extends Component<AssetTreeType> {
  state = {
    treeData: [],
    expandedKeys: {},
  };

  async componentDidMount() {
    const { assets, defaultExpandedKeys } = this.props;

    if (assets && assets.length > 0) {
      this.setState({
        treeData: this.mapDataAssets(assets),
        expandedKeys: defaultExpandedKeys
          ? this.toKeys(defaultExpandedKeys)
          : {},
      });
    }
  }

  mapDataAssets = (assets: VAsset[]) => {
    const nodes: { [name: string]: TreeNodeData } = {};

    assets.forEach(asset => {
      nodes[asset.id] = this.returnPretty(asset);
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
  };

  returnPretty = (asset: VAsset) => ({
    title: `${asset.name}: ${asset.description}`,
    key: asset.id,
    node: asset,
    isLeaf: true,
  });

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

  toKeys = (path: string[], initial = {}) =>
    path.reduce((acc, i) => ({ ...acc, [i]: true }), initial);

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: this.toKeys(expandedKeys),
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

export default AssetTree;
