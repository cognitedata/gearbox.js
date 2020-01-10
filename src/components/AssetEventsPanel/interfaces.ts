import { WithAssetEventsDataProps, WithAssetEventsProps } from '../../hoc';
import { AnyIfEmpty } from '../../interfaces';

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

export interface MetaEventsProps extends TableDesignType {
  columns?: TableColumnType[];
}

export interface AssetEventsPanelStylesProps {
  styles?: AssetEventsPanelStyles;
}

export interface AssetEventsPanelThemeProps {
  theme?: AnyIfEmpty<{}>;
}

export type AssetEventsPanelProps = WithAssetEventsProps &
  MetaEventsProps &
  AssetEventsPanelStylesProps &
  AssetEventsPanelThemeProps;

export type AssetEventsPanelPropsPure = WithAssetEventsDataProps &
  MetaEventsProps &
  AssetEventsPanelStylesProps &
  AssetEventsPanelThemeProps;
