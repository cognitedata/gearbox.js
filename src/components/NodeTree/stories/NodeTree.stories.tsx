import React from 'react';
import * as sdk from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { NodeTree } from '../NodeTree';
import { OnSelectNodeTreeParams } from '../../../interfaces';
import {
    ASSET_TREE_STYLES,
    NODE_LIST,
    NODE_MAINLIST,
    NODE_SUBLIST,
    NODE_LEAF,
    KEY_LIST
  } from '../../../mocks';
import fullDescription from './full.md';
import clickItem from './clickItem.md';
import defaultExpanded from './defaultExpanded.md';
import customStyles from './customStyles.md';

const setupMocks = () => {
    sdk.ThreeD.listNodes = async (_: number , __: number, params: sdk.ThreeDListNodesParams) => {
      if (params.nodeId) {
          switch(params.nodeId) {
            case 7587176698924415: {
              return {items: NODE_MAINLIST};
            }
            case 256009974666491: {
              return {items: NODE_SUBLIST};
            }
            case 8901019261985265: {
              return {items: NODE_LEAF};
            }
            default: {
              return {items: NODE_LIST.filter(node => node.id == params.nodeId)};
            }
          }
      }
      return { items: NODE_LIST};
    };
  };

  storiesOf('NodeTree', module).add(
    'Full description',
    () => {
      setupMocks();
      return <NodeTree />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

  storiesOf('NodeTree/Examples', module).add(
    'Click item in tree',
    () => {
      setupMocks();
      return (
        <NodeTree
          onSelect={(e: OnSelectNodeTreeParams) => action('onSelect')(e)}
        />
      );
    },
    {
      readme: {
        content: clickItem,
      },
    }
  ).add(
    'Default expanded node',
    () => {
      setupMocks();
      return (
        <NodeTree
          defaultExpandedKeys={KEY_LIST}
        />
      );
    },
    {
      readme: {
        content: defaultExpanded,
      },
    }
  ).add(
    'Custom Styles',
    () => {
      setupMocks();
      return <NodeTree styles={ASSET_TREE_STYLES} />;
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
