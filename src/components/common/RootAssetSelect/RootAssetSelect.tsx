import * as sdk from '@cognite/sdk'; // TODO
import { Select } from 'antd';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { withDefaultTheme } from '../../../hoc/withDefaultTheme';
import { AnyIfEmpty, IdCallback, PureObject } from '../../../interfaces';
import { defaultTheme } from '../../../theme/defaultTheme';
// TODO update to work with SDK 2.0
async function getRootAssetList(): Promise<sdk.Asset[]> {
  const apiAssets = await sdk.Assets.list({ depth: 0 });

  return apiAssets.items
    ? apiAssets.items.map(
        (apiAsset: sdk.Asset): sdk.Asset => {
          return {
            id: apiAsset.id,
            name: apiAsset.name || '',
            description: apiAsset.description,
            path: apiAsset.path,
            depth: apiAsset.depth,
            metadata: apiAsset.metadata,
            parentId: apiAsset.parentId,
            createdTime: apiAsset.createdTime,
            lastUpdatedTime: apiAsset.lastUpdatedTime,
          };
        }
      )
    : [];
}

export const defaultStrings: PureObject = {
  loading: 'Loading',
  all: '-- All --',
};

export interface RootAssetSelectStyles {
  select?: React.CSSProperties;
}

export interface RootAssetSelectProps {
  allowAll: boolean;
  assetId: number;
  className: string;
  strings: PureObject;
  onAssetSelected?: IdCallback;
  styles?: RootAssetSelectStyles;
  theme?: AnyIfEmpty<{}>;
}

interface RootAssetSelectState {
  current: number;
  assets: sdk.Asset[] | null;
}

export class RootAssetSelectComponent extends React.Component<
  RootAssetSelectProps,
  RootAssetSelectState
> {
  static defaultProps = {
    allowAll: true,
    assetId: 0,
    className: '',
    strings: {},
    theme: { ...defaultTheme },
  };

  constructor(props: RootAssetSelectProps) {
    super(props);

    const { assetId } = props;

    this.state = {
      current: assetId,
      assets: null,
    };
  }

  async componentDidMount() {
    const assets = await getRootAssetList();

    this.setState({ assets });
  }

  onSelectAsset = (selectedAssetId: number) => {
    const { onAssetSelected } = this.props;

    this.setState({ current: selectedAssetId });

    if (onAssetSelected) {
      onAssetSelected(selectedAssetId);
    }
  };

  render() {
    const { allowAll, className, strings, styles } = this.props;
    const { current, assets } = this.state;

    const lang = { ...defaultStrings, ...strings };
    const { all, loading } = lang;

    return assets === null || !assets.length ? (
      <>
        <GlobalStyle />
        <Select
          value={0}
          className={className}
          dropdownMatchSelectWidth={false}
          loading={true}
        >
          <Select.Option key="global:loading" value={0}>
            {loading}
          </Select.Option>
        </Select>
      </>
    ) : (
      <>
        <GlobalStyle />
        <Select
          value={current}
          className={className}
          onChange={this.onSelectAsset}
          dropdownMatchSelectWidth={false}
          style={styles && styles.select}
        >
          {allowAll && (
            <Select.Option key="all" value={0}>
              {all}
            </Select.Option>
          )}
          {assets.map(asset => (
            <Select.Option key={asset.id} value={asset.id}>
              {asset.description || asset.name || asset.id}
            </Select.Option>
          ))}
        </Select>
      </>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  .ant-select-dropdown-menu-item-active {
    background-color: ${(props: any) => props.theme.selectColor} !important;
  }

  .ant-select-dropdown-menu-item:hover {
    background-color: transparent !important;
  }

  .ant-select-dropdown-menu-item-active.ant-select-dropdown-menu-item:hover {
    background-color: ${(props: any) => props.theme.selectColor} !important;
  }
`;

GlobalStyle.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const Component = withDefaultTheme(RootAssetSelectComponent);
Component.displayName = 'RootAssetSelect';

export { Component as RootAssetSelect };
