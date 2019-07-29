import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import MenuItem from 'antd/lib/menu/MenuItem';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  OnRightClickNodeTreeParams,
  OnSelectNodeTreeParams,
} from '../../../interfaces';
import {
  ASSET_TREE_STYLES,
  KEY_LIST,
  NODE_LEAF,
  NODE_LIST,
  NODE_MAINLIST,
  NODE_SUBLIST,
} from '../../../mocks';
import { ThreeDNodeTree } from '../ThreeDNodeTree';
import clickItem from './clickItem.md';
import customStyles from './customStyles.md';
import defaultExpanded from './defaultExpanded.md';
import fullDescription from './full.md';
import rightClickItem from './rightClickItem.md';
import withTheme from './withTheme.md';

const setupMocks = () => {
  sdk.ThreeD.listNodes = async (
    _: number,
    __: number,
    params: sdk.ThreeDListNodesParams
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
          return { items: NODE_LIST.filter(node => node.id === params.nodeId) };
        }
      }
    }
    return { items: NODE_LIST };
  };
};

interface RightClickState {
  visible: boolean;
  rightClickedNode?: string;
  menuStyle: {
    [_: string]: string;
  };
}

class RightClickExample extends React.Component<{}, RightClickState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
      menuStyle: {},
    };
  }
  showSubMenu = () => {
    return this.state.visible ? (
      <Menu
        theme="dark"
        style={this.state.menuStyle}
        onClick={(params: ClickParam) => {
          if (this.state.rightClickedNode) {
            switch (params.key) {
              case '1': {
                alert('1: ' + this.state.rightClickedNode);
                break;
              }
              case '2': {
                alert('2: ' + this.state.rightClickedNode);
                break;
              }
              default:
                break;
            }
          }
        }}
      >
        <MenuItem key="1">Menu Item 1</MenuItem>
        <MenuItem key="2">Menu Item 2</MenuItem>
      </Menu>
    ) : (
      <></>
    );
  };
  componentDidMount() {
    document.addEventListener('click', () => {
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
        {this.showSubMenu()}
      </>
    );
  }
}

storiesOf('ThreeDNodeTree', module).add(
  'Full description',
  () => {
    setupMocks();
    return <ThreeDNodeTree modelId={0} revisionId={0} />;
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
      setupMocks();
      return (
        <ThreeDNodeTree
          modelId={0}
          revisionId={0}
          onSelect={(e: OnSelectNodeTreeParams) => action('onSelect')(e)}
        />
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
      setupMocks();
      return <RightClickExample />;
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
      setupMocks();
      return (
        <ThreeDNodeTree
          modelId={0}
          revisionId={0}
          defaultExpandedKeys={KEY_LIST}
        />
      );
    },
    {
      readme: {
        content: defaultExpanded,
      },
    }
  )
  .add(
    'Custom Styles',
    () => {
      setupMocks();
      return (
        <ThreeDNodeTree modelId={0} revisionId={0} styles={ASSET_TREE_STYLES} />
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  )
  .add(
    'With Theme',
    () => {
      setupMocks();
      const exampleTheme = {
        gearbox: {
          textColor: 'Chocolate',
          fontFamily: 'Comic Sans MS',
          fontSize: '16px',
        },
      };
      return (
        <ThemeProvider theme={exampleTheme}>
          <ThreeDNodeTree modelId={0} revisionId={0} />
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: withTheme,
      },
    }
  );
