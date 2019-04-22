import { Asset } from '@cognite/sdk';
import { ApiEvent, MetadataId } from './index';

export type AssetPanelType = 'details' | 'events' | 'documents';

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

export interface AssetEventsPanelProps extends TableDesignType {
  columns?: TableColumnType[];
  events?: ApiEvent[];
}

export interface TreeNodeType {
  title: string;
  description?: string;
  children?: TreeNodeType[];
  [name: string]: any;
}

export interface AssetQuery {
  limit: number;
  depth: number;
  [name: string]: any;
}

export interface OnSelectReturnType {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Asset;
}

export interface AssetTreeType {
  assets?: Asset[];
  loadData?: (assetId: number, query: AssetQuery) => Asset[];
  onSelect?: (onSelect: OnSelectReturnType) => void;
  defaultExpandedKeys?: string[];
}

export interface AdvancedSearch {
  name?: string;
  description?: string;
  metadata?: MetadataId[];
}
