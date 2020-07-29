// Copyright 2020 Cognite AS
import { List3DNodesQuery } from '@cognite/sdk';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import React from 'react';
import {
  NODE_LEAF,
  NODE_LIST,
  NODE_MAINLIST,
  NODE_SUBLIST,
} from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import {
  OnRightClickNodeTreeParams,
  OnSelectNodeTreeParams,
} from '../interfaces';
import { ThreeDNodeTree } from '../ThreeDNodeTree';

class CogniteClient extends MockCogniteClient {
  viewer3D: any = {
    listRevealNodes3D: async (
      _: number,
      __: number,
      params: List3DNodesQuery
    ) => {
      if (params.nodeId) {
        switch (params.nodeId) {
          case 7587176698924415: {
            return { items: NODE_MAINLIST };
          }
          case 256009974666491: {
            return { items: NODE_SUBLIST };
          }
          case 8901019261985265: {
            return { items: NODE_LEAF };
          }
          default: {
            return {
              items: NODE_LIST.filter(node => node.id === params.nodeId),
            };
          }
        }
      }
      return { items: NODE_LIST };
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const onSelectTreeNode = (e: OnSelectNodeTreeParams) =>
  console.log('onSelect', e);

interface RightClickState {
  visible: boolean;
  rightClickedNode?: string;
  menuStyle: {
    [_: string]: string;
  };
}

export class RightClickExample extends React.Component<
  Record<string, unknown>,
  RightClickState
> {
  menu: HTMLDivElement | null = null;
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      visible: false,
      menuStyle: {},
    };
  }
  renderSubMenu = () => {
    return this.state.visible ? (
      <Menu
        theme="dark"
        style={this.state.menuStyle}
        onClick={() => {
          if (this.state.rightClickedNode) {
            alert(this.state.rightClickedNode);
          }
        }}
      >
        <MenuItem>Menu Item 1</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
      </Menu>
    ) : (
      <></>
    );
  };
  componentDidMount() {
    document.body.addEventListener('click', (e: MouseEvent) => {
      // Ignore clicks on the context menu itself
      if (this.menu && this.menu.contains(e.target as Node)) {
        return;
      }
      // Close context menu when click outside of it
      this.setState({
        visible: false,
      });
    });
  }
  render() {
    return (
      <>
        <ThreeDNodeTree
          modelId={6265454237631097}
          revisionId={3496204575166890}
          onRightClick={(e: OnRightClickNodeTreeParams) => {
            this.setState({
              visible: true,
              menuStyle: {
                position: 'fixed',
                top: `${e.event.clientY}px`,
                left: `${e.event.clientX + 20}px`,
              },
              rightClickedNode: e.node.props.title,
            });
          }}
        />
        <div ref={node => (this.menu = node)}>{this.renderSubMenu()}</div>
      </>
    );
  }
}

export const expandedKeys = [
  8901019261985265,
  7587176698924415,
  256009974666491,
];

export const customStyle = {
  list: {
    fontFamily: 'Courier New',
    fontSize: 'large',
  },
};

export const exampleTheme = {
  gearbox: {
    textColor: 'Chocolate',
    fontFamily: 'Comic Sans MS',
    fontSize: '16px',
  },
};
