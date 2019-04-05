import { VApiEvent, VId, VMetadata } from './index';

export type assetPanels = 'details' | 'events' | 'documents';

export interface AssetType {
  id: VId;
  name: string;
  description?: string;
  path?: VId[];
  depth?: number;
  metadata?: VMetadata;
  [propName: string]: any;
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
  key: VId;
  title: string;
  isLeaf?: boolean;
  node?: AssetType;
}

export interface AssetTreeType {
  assets?: AssetType[];
  loadData?: (assetId: VId, query: AssetQuery) => AssetType[];
  onSelect?: (onSelect: OnSelectReturnType) => void;
  selectedKeys?: string[];
}
