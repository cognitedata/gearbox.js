import { List3DNodesQuery } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  OnRightClickNodeTreeParams,
  OnSelectNodeTreeParams,
} from '../../../interfaces';
import {
  KEY_LIST,
  NODE_LEAF,
  NODE_LIST,
  NODE_MAINLIST,
  NODE_SUBLIST,
} from '../../../mocks';
import { ASSET_TREE_STYLES } from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider/ClientSDKProvider';
import { ThreeDNodeTree } from '../ThreeDNodeTree';
import clickItem from './clickItem.md';
import customStyles from './customStyles.md';
import defaultExpanded from './defaultExpanded.md';
import fullDescription from './full.md';
import rightClickItem from './rightClickItem.md';
import withTheme from './withTheme.md';

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

const sdk = new CogniteClient({ appId: 'gearbox test' });

interface RightClickState {
  visible: boolean;
  rightClickedNode?: string;
  menuStyle: {
    [_: string]: string;
  };
}

// tslint:disable-next-line: max-classes-per-file
class RightClickExample extends React.Component<{}, RightClickState> {
  menu: HTMLDivElement | null = null;
  constructor(props: {}) {
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
      <ClientSDKProvider client={sdk}>
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
      </ClientSDKProvider>
    );
  }
}

storiesOf('ThreeDNodeTree', module).add(
  'Full description',
  () => {
    return (
      <ClientSDKProvider client={sdk}>
        <ThreeDNodeTree modelId={0} revisionId={0} />
      </ClientSDKProvider>
    );
  },
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('ThreeDNodeTree/Examples', module)
  .add(
    'Click item in tree',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <ThreeDNodeTree
            modelId={0}
            revisionId={0}
            onSelect={(e: OnSelectNodeTreeParams) => action('onSelect')(e)}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: clickItem,
      },
    }
  )
  .add(
    'Right Click Item in Tree',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <RightClickExample />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: rightClickItem,
      },
    }
  )
  .add(
    'Default expanded node',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <ThreeDNodeTree
            modelId={0}
            revisionId={0}
            defaultExpandedKeys={KEY_LIST}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: defaultExpanded,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <ThreeDNodeTree
            modelId={0}
            revisionId={0}
            styles={ASSET_TREE_STYLES}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  )
  .add(
    'With theme',
    () => {
      const exampleTheme = {
        gearbox: {
          textColor: 'Chocolate',
          fontFamily: 'Comic Sans MS',
          fontSize: '16px',
        },
      };
      return (
        <ThemeProvider theme={exampleTheme}>
          <ClientSDKProvider client={sdk}>
            <ThreeDNodeTree modelId={0} revisionId={0} />
          </ClientSDKProvider>
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: withTheme,
      },
    }
  );
