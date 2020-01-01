import { Asset } from '@cognite/sdk';
import { AutoPagingToArrayOptions } from '@cognite/sdk/dist/src/autoPagination';
import { CSSProperties, ReactNode } from 'react';
import { AnyIfEmpty } from '../interfaces';
import { MetadataId } from './index';

export type AssetPanelType = 'details' | 'events' | 'documents' | 'timeseries';

export interface TreeNodeData {
  title: string;
  key: number | string;
  children?: TreeNodeData[];
  isLeaf?: boolean;
  [name: string]: any;
}

export interface ValueListType {
  key?: string;
  name: string;
  value: string;
}

export interface TableColumnType {
  title: string;
  dataIndex: string;
  key?: string;
}

export interface TableDesignType {
  pagination?: {
    pageSize?: number;
    position?: 'top' | 'bottom' | 'both';
    showSizeChanger?: boolean;
  };
  scroll?: {
    y?: string;
    x?: string;
  };
  bordered?: boolean;
  showHeader?: boolean;
  style?: object;
}

export interface AssetEventsPanelStyles {
  table?: React.CSSProperties;
  tableRow?: React.CSSProperties;
  tableCell?: React.CSSProperties;
}
export interface TreeNodeType {
  title: string;
  description?: string;
  children?: TreeNodeType[];
  [name: string]: any;
}

export interface OnSelectAssetTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Asset;
}

export interface AssetTreeStyles {
  list?: React.CSSProperties;
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

export interface AdvancedSearch {
  name?: string;
  description?: string;
  metadata?: MetadataId[];
}

export interface WithAssetDataProps {
  asset: Asset;
}

export interface AssetDetailsPanelStylesProps {
  /**
   * Object that defines inline CSS style for container of the table
   */
  styles?: CSSProperties;
}

export interface WithAssetProps {
  /**
   * Asset Id
   */
  assetId: number;
  /**
   * A custom spinner to be shown in tabs while data is being loaded
   */
  customSpinner?: ReactNode;
  /**
   * callback function triggered after asset loaded
   */
  onAssetLoaded?: (asset: Asset) => void;
}
