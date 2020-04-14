import { CogniteEvent } from '@cognite/sdk';
import React, { CSSProperties } from 'react';
import { WithAssetEventsDataProps, WithAssetEventsProps } from '../../hoc';
import { AnyIfEmpty } from '../../interfaces';

export interface TableColumnType {
  title: string;
  dataIndex: string;
  key?: string;
}

export interface TableDesignType {
  /**
   * Configure table pagination appearance
   */
  pagination?: {
    pageSize?: number;
    position?: 'top' | 'bottom' | 'both';
    showSizeChanger?: boolean;
  };
  /**
   * Configure scroll appearance
   */
  scroll?: {
    y?: string;
    x?: string;
  };
  /**
   * Define if table has borders
   */
  bordered?: boolean;
  /**
   * Toggles table header visibility
   */
  showHeader?: boolean;
  /**
   * Custom table styles
   */
  style?: CSSProperties;
}

export interface AssetEventsPanelStyles {
  table?: CSSProperties;
  tableRow?: CSSProperties;
  tableCell?: CSSProperties;
}

export interface MetaEventsProps extends TableDesignType {
  /**
   * Array of objects that customize titles of the columns in the table
   */
  columns?: TableColumnType[];
}

export interface AssetEventsPanelStylesProps {
  /**
   * Object that defines inline CSS styles for inner elements of the component
   */
  styles?: AssetEventsPanelStyles;
}

export interface AssetEventsPanelThemeProps {
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}

export interface EventAddonsProp extends CogniteEvent {
  typeAndSubtype: React.ReactNode;
  start: string;
  end: string;
}

export type MetadataRenderer = (event: EventAddonsProp) => React.ReactNode;

export interface RenderMetadataProps {
  renderEventMetadata?: MetadataRenderer;
}

export type AssetEventsPanelProps = WithAssetEventsProps &
  MetaEventsProps &
  AssetEventsPanelStylesProps &
  AssetEventsPanelThemeProps;

export type AssetEventsPanelPropsPure = WithAssetEventsDataProps &
  MetaEventsProps &
  AssetEventsPanelStylesProps &
  AssetEventsPanelThemeProps &
  RenderMetadataProps;
