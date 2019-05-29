import { Asset } from '@cognite/sdk';
import { Select } from 'antd';
import React from 'react';
import { IdCallback, PureObject } from '../../../interfaces';

export const defaultStrings: PureObject = {
  loading: 'Loading',
  all: '-- all --',
};

export interface RootAssetSelectStyles {
  select?: React.CSSProperties;
}

export interface RootAssetSelectProps {
  assetId: number;
  assets: Asset[];
  className: string;
  allowAll: boolean;
  strings: PureObject;
  onAssetSelected?: IdCallback;
  styles?: RootAssetSelectStyles;
}

interface RootAssetSelectState {
  current: number;
}

export class RootAssetSelect extends React.Component<
  RootAssetSelectProps,
  RootAssetSelectState
> {
  static defaultProps = {
    assetId: 0,
    allowAll: true,
    className: '',
    strings: {},
  };

  constructor(props: RootAssetSelectProps) {
    super(props);

    const { assetId } = props;

    this.state = {
      current: assetId,
    };
  }
  onSelectAsset = (selectedAssetId: number) => {
    const { onAssetSelected } = this.props;

    this.setState({ current: selectedAssetId });

    if (onAssetSelected) {
      onAssetSelected(selectedAssetId);
    }
  };

  render() {
    const { allowAll, assets, className, strings, styles } = this.props;

    const lang = { ...defaultStrings, ...strings };
    const { all, loading } = lang;
    const { current } = this.state;

    if (assets === null || !assets.length) {
      return (
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
      );
    }

    return (
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
