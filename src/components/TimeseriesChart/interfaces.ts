import { AxisDisplayMode, AxisPlacement } from '@cognite/griff-react';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDatapoint,
  GetAggregateDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
} from '@cognite/sdk';
import React from 'react';

export type AxisDisplayModeKeys = keyof typeof AxisDisplayMode;
export type AxisPlacementKeys = keyof typeof AxisPlacement;
export type DataLoaderDatapoint =
  | GetAggregateDatapoint
  | GetDoubleDatapoint
  | GetStringDatapoint;
export type DataLoaderDatapoints =
  | GetAggregateDatapoint[]
  | GetDoubleDatapoint[]
  | GetStringDatapoint[];
export type DataLoaderFetchedDatapointsList =
  | DatapointsGetAggregateDatapoint[]
  | DatapointsGetDatapoint[];
export type AccessorFunction = (
  datapoint: DataLoaderDatapoint,
  index?: number,
  arr?: DataLoaderDatapoint[]
) => number;

export interface SeriesProps {
  color?: string;
  hidden?: boolean;
  step?: boolean;
  zoomable?: boolean;
  name?: string;
  timeAccessor?: AccessorFunction;
  xAccessor?: AccessorFunction;
  x0Accessor?: AccessorFunction;
  x1Accessor?: AccessorFunction;
  yAccessor?: AccessorFunction;
  y0Accessor?: AccessorFunction;
  y1Accessor?: AccessorFunction;
  yDomain?: [number, number];
  ySubDomain?: [number, number];
  yAxisPlacement?: AxisPlacementKeys;
  yAxisDisplayMode?: AxisDisplayModeKeys;
  opacity?: number;
}

export interface Annotation {
  id: number;
  data: number[];
  color: string;
  height?: number;
  fillOpacity?: number;
}

export interface TimeseriesChartSeries extends SeriesProps {
  id: number;
  collectionId?: number;
}

export interface TimeseriesChartRulerPoint {
  id: number;
  name: string;
  value: number;
  color: string;
  timestamp: number;
  x: number;
  y: number;
  hidden?: boolean;
}

export interface TimeseriesChartRuler {
  visible: boolean;
  timeFormatter?: (timestamp: number) => string;
  valueFormatter?: (value: number) => string;
}

export interface TimeseriesChartStyles {
  container?: React.CSSProperties;
}

export interface TimeseriesChartCollection extends SeriesProps {
  id: number;
}

export interface TimeseriesChartDomainUpdate {
  x: [number, number];
  y: [number, number];
  time: [number, number];
}

export interface TimeseriesChartProps {
  /**
   * Series array defined by timeseries ids or series objects
   */
  series: number[] | TimeseriesChartSeries[];
  /**
   * Time which timeseries should start from
   */
  start?: number | Date;
  /**
   * The time the timeseries should end. Should be UNIX timestamp or Date
   */
  end?: number | Date;
  /**
   * Whether the context chart should be showed
   */
  contextChart?: boolean;
  /**
   * Custom styles for the component
   */
  styles?: TimeseriesChartStyles;
  /**
   * The number of aggregated datapoints to show
   */
  pointsPerSeries?: number;
  /**
   * Whether zooming on the chart is enabled
   */
  zoomable?: boolean;
  /**
   * Whether live update of chart is enabled
   */
  liveUpdate?: boolean;
  /**
   * The update interval when live update is enabled
   */
  updateInterval?: number;
  /**
   * Display the ruler and configure custom label formatters
   */
  ruler?: TimeseriesChartRuler;
  /**
   * Height of x-axis container in pixels. 0 will hide it completely
   */
  xAxisHeight?: number;
  /**
   * Default display mode of the y-axis
   */
  yAxisDisplayMode?: AxisDisplayModeKeys;
  /**
   * Default placement of the y-axis
   */
  yAxisPlacement?: AxisPlacementKeys;
  /**
   * Height of the chart
   */
  height?: number;
  /**
   * Width of the chart
   */
  width?: number;
  /**
   * Mouse move callback
   */
  onMouseMove?: (e: any) => void;
  /**
   * On blur event callback
   */
  onBlur?: (e: any) => void;
  /**
   * On mouseout event callback
   */
  onMouseOut?: (e: any) => void;
  /**
   * Callback for failed data request
   */
  onFetchDataError?: (e: Error) => void;
  /**
   * Callback for domain update
   * @param e
   */
  onDomainsUpdate?: (e: {
    [seriesId: number]: TimeseriesChartDomainUpdate;
  }) => void;
  /**
   * Configuration to group few series into one collection
   * represented with single Y-axis
   */
  collections?: TimeseriesChartCollection[];
  /**
   * @ignore
   */
  annotations?: Annotation[];
}

export enum DataLoaderCallReasons {
  MOUNTED = 'MOUNTED',
  INTERVAL = 'INTERVAL',
  UPDATE_SUBDOMAIN = 'UPDATE_SUBDOMAIN',
}
