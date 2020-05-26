import { CogniteClient, List3DNodesQuery, RevealNode3D } from '@cognite/sdk';
import { Tree } from 'antd';
import {
  AntTreeNode,
  AntTreeNodeMouseEvent,
  AntTreeNodeProps,
} from 'antd/lib/tree';
import React, { Component } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { defaultTheme } from '../../theme/defaultTheme';
import {
  applyThemeFontFamily,
  applyThemeFontSize,
  applyThemeListHighlight,
} from '../../utils/theme';
import {
  NodeTreeProps,
  OnSelectNodeTreeParams,
  TreeNodeData,
  TreeNodeType,
} from './interfaces';

// TODO GENERAL
const { TreeNode } = Tree;

interface ExpandedKeysMap {
  [key: number]: true;
}

interface NodeTreeState {
  threeDNodes: RevealNode3D[];
  treeData: TreeNodeData[];
  expandedKeys: ExpandedKeysMap;
  modelId: number;
  revisionId: number;
  loadedKeys: string[];
}

const cursorApiRequest = async (
  sdk: CogniteClient,
  modelId: number,
  revisionId: number,
  params: List3DNodesQuery,
  data: RevealNode3D[] = []
): Promise<RevealNode3D[]> => {
  const result = await sdk.viewer3D.listRevealNodes3D(
    modelId,
    revisionId,
    params
  );
  const { nextCursor: cursor } = result;
  if (result.nextCursor) {
    return cursorApiRequest(sdk, modelId, revisionId, { ...params, cursor }, [
      ...data,
      ...result.items,
    ]);
  }
  return [...data, ...result.items];
};

class ThreeDNodeTree extends Component<NodeTreeProps, NodeTreeState> {
  static contextType = ClientSDKProxyContext;
  static defaultProps = {
    modelId: 0,
    revisionId: 0,
    onSelect: (selectedNode: OnSelectNodeTreeParams) => {
      return selectedNode.key;
    },
    theme: { ...defaultTheme },
  };

  static returnPretty(threeDNode: RevealNode3D) {
    return {
      title: `${threeDNode.name}`,
      key: threeDNode.id,
      node: threeDNode,
      isLeaf: threeDNode.subtreeSize === 1,
    };
  }

  static toKeys(path: number[], initial = {}): ExpandedKeysMap {
    return path.reduce((acc, i) => ({ ...acc, [i]: true }), initial);
  }

  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  constructor(props: NodeTreeProps) {
    super(props);
    const { defaultExpandedKeys } = props;
    this.state = {
      threeDNodes: [],
      treeData: [],
      expandedKeys: defaultExpandedKeys
        ? ThreeDNodeTree.toKeys(defaultExpandedKeys)
        : {},
      modelId: props.modelId,
      revisionId: props.revisionId,
      loadedKeys: [],
    };
  }

  async componentDidMount() {
    this.client = this.context(ThreeDNodeTreeWithTheme.displayName || '')!;
    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }

    const threeDNodes = await this.client.viewer3D.listRevealNodes3D(
      this.state.modelId,
      this.state.revisionId,
      { depth: 1 }
    );
    this.setState({
      threeDNodes: threeDNodes.items,
      treeData:
        threeDNodes && threeDNodes.items.length > 0
          ? this.mapDataNodes(threeDNodes.items)
          : [],
    });
  }

  mapDataNodes(threeDNodes: RevealNode3D[]): TreeNodeData[] {
    const nodes: { [name: string]: TreeNodeData } = {};

    threeDNodes.forEach(threeDNode => {
      if (threeDNode.depth === 0) {
        nodes[threeDNode.id] = ThreeDNodeTree.returnPretty(threeDNode);
      }
    });

    threeDNodes.forEach(threeDNode => {
      const { parentId } = threeDNode;

      const node = nodes[parentId as number]; // casting is not a problem. It will return undefined if not found
      if (!node) {
        return;
      }
    });
    return Object.keys(nodes).map(id => {
      if (nodes[id].isLeaf) {
        this.state.loadedKeys.push(`${id}`);
      }
      this.setState({
        loadedKeys: [...this.state.loadedKeys],
      });
      return nodes[id];
    });
  }

  onLoadData = async (treeNode: AntTreeNode) => {
    if (treeNode.props.children) {
      return;
    }
    const eventKey = treeNode.props.eventKey;
    const threeDnodeId = eventKey ? Number.parseInt(eventKey, 10) : undefined;

    if (threeDnodeId && !Number.isNaN(threeDnodeId)) {
      const query = {
        depth: 2,
        nodeId: threeDnodeId,
      };

      const loadedData = await this.cursorApiRequest(
        this.state.modelId,
        this.state.revisionId,
        query
      );
      if (loadedData.length > 1) {
        treeNode.props.dataRef.children = loadedData
          .slice(1)
          // @ts-ignore
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(x => x.parentId && x.parentId === treeNode.props.dataRef.key)
          .map(x => {
            if (loadedData.filter(y => y.parentId === x.id).length <= 0) {
              this.state.loadedKeys.push(`${x.id}`);
              return {
                title: `${x.name}`,
                key: x.id,
                node: x,
                isLeaf: true,
              };
            } else {
              return {
                title: `${x.name}`,
                key: x.id,
                node: x,
                isLeaf: false,
              };
            }
          });
        this.setState({
          loadedKeys: [...this.state.loadedKeys],
          treeData: [...this.state.treeData],
        });
      } else {
        treeNode.props.dataRef.isLeaf = true;
      }
    }
  };

  onSelectNode = (returnNode: OnSelectNodeTreeParams) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(returnNode);
    }
  };

  onRightClickNode = (event: AntTreeNodeMouseEvent) => {
    const { onRightClick } = this.props;
    if (onRightClick) {
      onRightClick(event);
    }
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys: ThreeDNodeTree.toKeys(
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
        loadedKeys={this.state.loadedKeys}
        onRightClick={this.onRightClickNode}
      >
        {this.renderTreeNode(treeData)}
      </Tree>
    );
  }

  private cursorApiRequest = async (
    modelId: number,
    revisionId: number,
    params: List3DNodesQuery,
    data: RevealNode3D[] = []
  ): Promise<RevealNode3D[]> => {
    const result = await this.client.viewer3D.listRevealNodes3D(
      modelId,
      revisionId,
      params
    );
    const { nextCursor: cursor } = result;
    if (result.nextCursor) {
      return this.cursorApiRequest(modelId, revisionId, { ...params, cursor }, [
        ...data,
        ...result.items,
      ]);
    }
    return [...data, ...result.items];
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

const ThreeDNodeTreeWithTheme = withDefaultTheme(ThreeDNodeTree);
ThreeDNodeTreeWithTheme.displayName = 'ThreeDNodeTree';

export { ThreeDNodeTreeWithTheme as ThreeDNodeTree };
export { ThreeDNodeTree as ThreeDNodeTreeWithoutTheme };
