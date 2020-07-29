// Copyright 2020 Cognite AS
import { Asset, CogniteInternalId } from '@cognite/sdk';

export type FetchAssetCall = (assetId: CogniteInternalId) => Promise<Asset>;

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
   * Function that can be used to replace embedded asset fetching
   */
  retrieveAsset?: FetchAssetCall;
  /**
   * Callback which is executed on a click action on asset in a breadcrumb.
   * It's only available in case of default asset rendering in a breadcrumb
   */
  onBreadcrumbClick?: (asset: Asset, depth: number) => void;
}
