import { Asset } from '@cognite/sdk/dist/src/types/types';
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
  onSelect?: (onSelect: OnSelectAssetTreeParams) => void;
  defaultExpandedKeys?: number[];
  styles?: AssetTreeStyles;
  theme?: AnyIfEmpty<{}>;
}

export interface AdvancedSearch {
  name?: string;
  description?: string;
  metadata?: MetadataId[];
}
