import { VApiEvent, VMetadata } from './index';

export type assetPanels = 'details' | 'events' | 'documents';

export interface TreeNodeData {
  title: string;
  key: number | string;
  children?: TreeNodeData[];
  isLeaf?: boolean;
  [name: string]: any;
}

export interface VAsset {
  id: number;
  name: string;
  description?: string;
  path?: number[];
  depth?: number;
  metadata?: VMetadata;
  parentId?: number;
  createdTime?: number;
  lastUpdatedTime?: number;
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
  events?: VApiEvent[];
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
  node?: VAsset;
}

export interface AssetTreeType {
  assets?: VAsset[];
  loadData?: (assetId: number, query: AssetQuery) => VAsset[];
  onSelect?: (onSelect: OnSelectReturnType) => void;
  defaultExpandedKeys?: string[];
}
