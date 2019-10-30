import { Asset } from '@cognite/sdk';
import { Breadcrumb, Icon } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKCacheContext } from '../../context/clientSDKCacheContext';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { AnyIfEmpty } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';

export interface AssetBreadcrumbProps {
  assetId: number;
  maxLength?: number;
  renderItem?: (asset: Asset, depth: number) => JSX.Element;
  onBreadcrumbClick?: (asset: Asset, depth: number) => void;
  theme?: AnyIfEmpty<{}>;
}

const ENTER_KEY_CODE = 13;

const renderBreadcrumbs = (
  assets: Asset[],
  renderAsset: (asset: Asset, depth: number) => JSX.Element,
  maxLength: number = 3
): JSX.Element[] => {
  const gapBreadcrumb = (
    <Breadcrumb.Item key={'...'}>
      <BreadcrumbSpan>...</BreadcrumbSpan>
    </Breadcrumb.Item>
  );
  const assetsToRender = assets.slice();

  if (assets.length > maxLength) {
    assetsToRender.splice(maxLength - 1, assets.length - maxLength);
  }

  const renderedList = assetsToRender.map((asset, assetIndex) => (
    <Breadcrumb.Item key={asset.id || assetIndex}>
      {renderAsset(asset, assetIndex)}
    </Breadcrumb.Item>
  ));

  if (assets.length > maxLength) {
    renderedList.splice(1, 0, gapBreadcrumb);
  }

  return renderedList;
};

const AssetBreadcrumb: React.FC<AssetBreadcrumbProps> = ({
  assetId,
  maxLength = 3,
  renderItem,
  onBreadcrumbClick = () => undefined,
}: AssetBreadcrumbProps) => {
  const context = useContext(ClientSDKCacheContext);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchAsset = async (id: number): Promise<Asset> => {
    const [asset] = await context!.assets.retrieve([{ id }]);

    return asset;
  };

  const renderValue = (asset: Asset, index: number): JSX.Element => {
    if (renderItem) {
      return renderItem(asset, index);
    }

    return (
      <BreadcrumbSpan
        tabIndex={0}
        role="button"
        onClick={() => onBreadcrumbClick(asset, index)}
        onKeyDown={e =>
          e.keyCode === ENTER_KEY_CODE && onBreadcrumbClick(asset, index)
        }
      >
        {asset.name || asset.id}
      </BreadcrumbSpan>
    );
  };

  useEffect(() => {
    let canceled = false;

    if (!context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }

    const generateAssetChain = async (id: number): Promise<void> => {
      const assetChain: Asset[] = [];
      console.log('Called with ', id);

      setIsLoading(true);

      let asset: Asset = await fetchAsset(id);

      assetChain.push(asset);

      while (asset.parentId && !canceled) {
        asset = await fetchAsset(asset.parentId);
        assetChain.push(asset);
      }

      if (canceled) {
        return;
      }

      assetChain.reverse();
      setAssets(assetChain);
      setIsLoading(false);
    };

    generateAssetChain(assetId);

    return () => {
      console.log('Canceled');
      canceled = true;
    };
  }, [assetId]);

  return isLoading ? (
    <Icon type="loading" />
  ) : (
    <BreadcrumbWrapper>
      <Breadcrumb>
        {renderBreadcrumbs(assets, renderValue, maxLength)}
      </Breadcrumb>
    </BreadcrumbWrapper>
  );
};

AssetBreadcrumb.defaultProps = {
  theme: defaultTheme,
};

const BreadcrumbWrapper = styled.div`
  .ant-breadcrumb-separator {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.45);
  }
`;
const BreadcrumbSpan = styled(`span`)`
  cursor: pointer;
`;

const Component = withDefaultTheme(AssetBreadcrumb);
Component.displayName = 'AssetBreadcrumb';

export { Component as AssetBreadcrumb };
