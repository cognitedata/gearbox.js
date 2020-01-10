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
  timeseriesId: number;
  color?: string;
  dateFormat?: string;
  nameFormatter?: (name?: string) => string;
  descriptionFormatter?: (description?: string) => string;
  updateInterval?: number;
  valueToDisplay?: GetDoubleDatapoint | GetStringDatapoint;
  dropdown?: TimeseriesPreviewMenuConfig;
  retrieveTimeseries?: FetchTimeserieCall;
  retrieveLatestDatapoint?: FetchLatestDatapointCall;
  formatDisplayValue?: (value?: string | number) => string | number;
  onToggleVisibility?: (timeseries: GetTimeSeriesMetadataDTO) => void;
  styles?: TimeseriesPreviewStyles;
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
