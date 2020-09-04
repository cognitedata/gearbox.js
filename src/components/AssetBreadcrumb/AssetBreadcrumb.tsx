// Copyright 2020 Cognite AS
import { Asset } from '@cognite/sdk';
import { Breadcrumb, Icon } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { withDefaultTheme } from '../../hoc';
import { AssetBreadcrumbProps } from './interfaces';

const ENTER_KEY_CODE = 13;

const renderBreadcrumbs = (
  assets: Asset[],
  renderAsset: (asset: Asset, depth: number) => JSX.Element,
  maxLength: number = 7
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

/**
 * Component AssetBreadcrumb
 * @param assetId: number
 * @param maxLength: number = 3
 * @param renderItem: (asset: Asset, depth: number) => JSX.Element;
 * @param onBreadcrumbClick: (asset: Asset, depth: number) => void;
 * @constructor
 */
const AssetBreadcrumb: FC<AssetBreadcrumbProps> = ({
  assetId,
  maxLength = 3,
  renderItem,
  retrieveAsset,
  onBreadcrumbClick = () => undefined,
}: AssetBreadcrumbProps) => {
  const context = useCogniteContext(Component);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchAsset = async (id: number): Promise<Asset> => {
    const [asset] = retrieveAsset
      ? [await retrieveAsset(id)]
      : await context!.assets.retrieve([{ id }]);
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

      setIsLoading(true);

      let asset: Asset = await fetchAsset(id);
      let rootAsset: Asset | null = null;
      const { rootId } = asset;

      assetChain.push(asset);

      while (asset.parentId && !canceled) {
        if (asset.id !== id && asset.parentId === rootId) {
          break;
        } else if (asset.id === id && asset.parentId !== rootId) {
          [rootAsset, asset] = await Promise.all([
            fetchAsset(rootId),
            fetchAsset(asset.parentId),
          ]);
        } else {
          asset = await fetchAsset(asset.parentId);
        }

        assetChain.push(asset);
      }

      if (canceled) {
        return;
      }

      if (rootAsset) {
        assetChain.push(rootAsset);
      }

      assetChain.reverse();
      setAssets(assetChain);
      setIsLoading(false);
    };

    generateAssetChain(assetId);

    return () => {
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
