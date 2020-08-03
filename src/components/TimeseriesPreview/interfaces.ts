// Copyright 2020 Cognite AS
import {
  DatapointsGetDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { CSSProperties } from 'react';
import { PureObject } from '../../interfaces';

export type FetchLatestDatapointCall = (
  timeseriesId: InternalId
) => Promise<DatapointsGetDatapoint[]>;

export type FetchTimeserieCall = (
  timeseriesId: InternalId
) => Promise<GetTimeSeriesMetadataDTO[]>;

export interface TimeseriesPreviewProps {
  /**
   * Timeseries id
   */
  timeseriesId: number;
  /**
   * Rendered as a background color for the left side of the component
   */
  color?: string;
  /**
   * Defines date format to be applied on datapoint timestamp
   */
  dateFormat?: string;
  /**
   * Function, that formats timeseries name value to be displayed
   */
  nameFormatter?: (name?: string) => string;
  /**
   * Function that formats timeseries description value to be displayed
   */
  descriptionFormatter?: (description?: string) => string;
  /**
   * Refresh latest datapoint interval in ms
   */
  updateInterval?: number;
  /**
   * Datapoint to be rendered instead of latest datapoint. Pause fetching latest datapoint if provided
   */
  valueToDisplay?: GetDoubleDatapoint | GetStringDatapoint;
  /**
   * Configuration, that describes dropdown menu to be rendered
   */
  dropdown?: TimeseriesPreviewMenuConfig;
  /**
   * Function that can be used to replace embedded timeseries fetching logic
   */
  retrieveTimeseries?: FetchTimeserieCall;
  /**
   * Function that can be used to replace embedded latest datapoint fetching
   */
  retrieveLatestDatapoint?: FetchLatestDatapointCall;
  /**
   * Function that gives ability to format rendered value of latest or provided datapoint
   */
  formatDisplayValue?: (value?: string | number) => string | number;
  /**
   * Callback that triggers in case of click on visibility icon
   */
  onToggleVisibility?: (timeseries: GetTimeSeriesMetadataDTO) => void;
  /**
   * Styles, that can be provided to customize component view
   */
  styles?: TimeseriesPreviewStyles;
  /**
   * Strings, that can be customized
   */
  strings?: PureObject;
}

export interface TimeseriesPreviewStyles {
  wrapper?: CSSProperties;
  card?: CSSProperties;
  leftSide?: CSSProperties;
  rightSide?: CSSProperties;
  tagName?: CSSProperties;
  description?: CSSProperties;
  value?: CSSProperties;
  date?: CSSProperties;
  dropdown?: DropdownMenuStyles;
}

export interface TimeseriesPreviewMenuConfig {
  options: PureObject;
  onClick: (key: string, timeseries: GetTimeSeriesMetadataDTO) => void;
}

export interface DropdownMenuStyles {
  menu?: CSSProperties;
  item?: CSSProperties;
}
