import { Asset } from '@cognite/sdk';
import { Breadcrumb, Icon } from 'antd';
import React, { FC, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ERROR_NO_SDK_CLIENT } from '../../constants/errorMessages';
import { ClientSDKCacheContext } from '../../context/clientSDKCacheContext';

export interface AssetBreadcrumbProps {
  /**
   * Asset ID
   */
  assetId: number;
  /**
   * Maximal number of assets to be displayed.
   * If length of the asset chain bigger than < maxLength > value,
   * asset chain will be shrunk to root element plus < maxLength > - 1 number
   * of last elements in a chain
   */
  maxLength?: number;
  /**
   * Function, that can be used for custom rendering of asset in a breadcrumb
   */
  renderItem?: (asset: Asset, depth: number) => JSX.Element;
  /**
   * Callback which is executed on a click action on asset in a breadcrumb.
   * It's only available in case of default asset rendering in a breadcrumb
   */
  onBreadcrumbClick?: (asset: Asset, depth: number) => void;
}

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
export const AssetBreadcrumb: FC<AssetBreadcrumbProps> = ({
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
