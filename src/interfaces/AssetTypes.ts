import { Asset, Event } from '@cognite/sdk';
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

export interface MetaEventsProps extends TableDesignType {
  columns?: TableColumnType[];
}

export interface AssetEventsPanelStyles {
  table?: React.CSSProperties;
  tableRow?: React.CSSProperties;
  tableCell?: React.CSSProperties;
}

export interface AssetEventsPanelProps extends MetaEventsProps {
  events?: Event[];
  styles?: AssetEventsPanelStyles;
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

export interface AssetTreeProps {
  onSelect?: (onSelect: OnSelectAssetTreeParams) => void;
  defaultExpandedKeys?: number[];
}

export interface AdvancedSearch {
  name?: string;
  description?: string;
  metadata?: MetadataId[];
}
