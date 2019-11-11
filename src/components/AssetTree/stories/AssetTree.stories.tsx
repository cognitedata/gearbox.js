import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { OnSelectAssetTreeParams } from '../../../interfaces';
import {
  ASSET_LIST_CHILD,
  ASSET_TREE_STYLES,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../../mocks/assetsListV2';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetTree } from '../AssetTree';
import assetIds from './assetIds.md';
import basic from './basic.md';
import clickItem from './clickItem.md';
import customStyles from './customStyles.md';
import defaultExpanded from './defaultExpanded.md';
import displayName from './displayName.md';
import fullDescription from './full.md';
import withTheme from './withTheme.md';

const ExampleTheme = {
  gearbox: {
    fontFamily: 'Courier New',
    fontSize: 'large',
    textColor: '#a88400',
    highlightColor: '#00b893',
  },
};

const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(
  asset => asset.rootId === asset.id
);

class CogniteClient extends MockCogniteClient {
  assets: any = {
    // @ts-ignore
    list: scope => ({
      autoPagingToArray: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            if (scope && scope.filter && scope.filter.parentIds) {
              const { parentIds } = scope.filter;
              resolve(
                ASSET_LIST_CHILD.filter(a => a.parentId === parentIds[0])
              );
            }
            resolve(ASSET_ZERO_DEPTH_ARRAY);
          }, 300);
        });
      },
    }),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

const clientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
);

storiesOf('AssetTree', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Full Description',
    () => {
      return <AssetTree />;
    },
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('AssetTree/Examples', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Basic',
    () => {
      return <AssetTree />;
    },
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Default expanded node',
    () => {
      return (
        <AssetTree
          defaultExpandedKeys={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]}
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
    'Click item in tree',
    () => {
      return (
        <AssetTree
          onSelect={(e: OnSelectAssetTreeParams) => action('onSelect')(e)}
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
    'Custom display name',
    () => {
      return <AssetTree displayName={({ id }) => `Id: ${id}`} />;
    },
    {
      readme: {
        content: displayName,
      },
    }
  )
  .add(
    'Asset IDs',
    () => {
      return <AssetTree assetIds={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]} />;
    },
    {
      readme: {
        content: assetIds,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      return <AssetTree styles={ASSET_TREE_STYLES} />;
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
      return (
        <ThemeProvider theme={ExampleTheme}>
          <AssetTree />
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: withTheme,
      },
    }
  );
