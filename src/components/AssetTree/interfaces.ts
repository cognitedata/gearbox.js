import { Asset } from '@cognite/sdk';
import { AutoPagingToArrayOptions } from '@cognite/sdk/dist/src/autoPagination';
import { AnyIfEmpty } from '../../interfaces';

export interface AssetTreeStyles {
  list?: React.CSSProperties;
}

export interface OnSelectAssetTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Asset;
}

export interface AssetTreeProps {
  /**
   * Modify the display name of an asset
   */
  displayName?: (asset: Asset) => string;
  /**
   * Triggers when a node is selected
   */
  onSelect?: (onSelect: OnSelectAssetTreeParams) => void;
  /**
   * To display a tree with provided assets as root nodes
   */
  assetIds?: number[];
  /**
   * Show loading animation when fetching original list
   */
  showLoading?: boolean;
  /**
   * List of node ids to be expanded by default
   */
  defaultExpandedKeys?: number[];
  /**
   * Object that defines inline CSS styles for
   * inner elements of the component.
   */
  styles?: AssetTreeStyles;

  theme?: AnyIfEmpty<{}>;

  autoPagingToArrayOptions?: AutoPagingToArrayOptions;
}
