import React from 'react';
import { Select } from 'antd';
import { VId, VAsset, VMetadata, VIdCallback } from 'utils/validators';

export const defaultStrings: VMetadata = {
  loading: 'Loading',
  all: '-- all --',
};

export interface RootAssetSelectProps {
  assetId: VId;
  assets: VAsset[];
  onAssetSelected: VIdCallback;
  className: string;
  allowAll: boolean;
  strings: VMetadata;
}

export interface RootAssetSelectState {
  current: VId;
}

class RootAssetSelect extends React.Component<
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
  onSelectAsset = (selectedAssetId: VId) => {
    const { onAssetSelected } = this.props;

    this.setState({ current: selectedAssetId }, () =>
      onAssetSelected(selectedAssetId)
    );
  };

  render() {
    const { allowAll, assets, className, strings } = this.props;

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

export default RootAssetSelect;
