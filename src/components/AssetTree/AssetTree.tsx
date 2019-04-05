import React, { Component } from 'react';
import { Tree } from 'antd';
import { AntTreeNode } from 'antd/lib/tree';
import {
  AssetTreeType,
  TreeNodeType,
  AssetType,
  OnSelectReturnType,
} from 'utils/validators';

const { TreeNode } = Tree;

class AssetTree extends Component<AssetTreeType> {
  state = {
    treeData: [],
  };

  async componentDidMount() {
    const { assets } = this.props;

    if (assets && assets.length > 0) {
      this.setState({ treeData: this.sortAndMapAssets(assets) });
    }
  }

  sortAndMapAssets = (assets: AssetType[]) => {
    assets.sort((a, b) => a.name.localeCompare(b.name));

    return assets.map(x => ({
      title: `${x.name}: ${x.description}`,
      key: x.id,
    }));
  };

  onLoadData = async (treeNode: AntTreeNode) => {
    const { loadData } = this.props;

    if (treeNode.props.children) {
      return;
    }
    const assetId = treeNode.props.eventKey;

    if (loadData && assetId) {
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

  renderTreeNode = (nodes: TreeNodeType[]) =>
    nodes.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.title} dataRef={item}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.title} dataRef={item} />;
    });

  render() {
    const { selectedKeys } = this.props;
    const { treeData } = this.state;

    return (
      <Tree
        loadData={this.onLoadData}
        selectedKeys={selectedKeys}
        onSelect={(_, e) => this.onSelectNode(e.node.props.dataRef)}
      >
        {this.renderTreeNode(treeData)}
      </Tree>
    );
  }
}

export default AssetTree;
