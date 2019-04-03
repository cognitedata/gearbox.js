import { VApiEvent, VMetadata } from './index';

export type id = number | string;

export type assetPanels = 'details' | 'events' | 'documents';

export interface AssetType {
  id: id;
  name?: string;
  description?: string;
  path?: id[];
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
