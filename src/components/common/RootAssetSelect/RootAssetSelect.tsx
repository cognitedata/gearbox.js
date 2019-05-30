import * as sdk from '@cognite/sdk';
import { Select } from 'antd';
import React from 'react';
import { IdCallback, PureObject } from '../../../interfaces';

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
}

interface RootAssetSelectState {
  current: number;
  assets: sdk.Asset[] | null;
}

export class RootAssetSelect extends React.Component<
  RootAssetSelectProps,
  RootAssetSelectState
> {
  static defaultProps = {
    allowAll: true,
    assetId: 0,
    className: '',
    strings: {},
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
    ) : (
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
    );
  }
}
