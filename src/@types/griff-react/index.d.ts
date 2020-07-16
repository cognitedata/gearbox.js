declare module '@cognite/griff-react' {
  import { GetAggregateDatapoint } from '@cognite/sdk';
  import { Component } from 'react';
  import {
    AccessorFunction,
    DataLoaderDatapoints,
  } from '../../components/TimeseriesChart';

  export type DataLoaderCallReasonsType =
    | 'MOUNTED'
    | 'INTERVAL'
    | 'UPDATE_SUBDOMAIN';
  export interface DataLoaderProps {
    id: number;
    timeDomain: number[];
    timeSubDomain: number[];
    pointsPerSeries: number;
    oldSeries: DataProviderSeriesWithDatapoints;
    reason: DataLoaderCallReasonsType;
  }

  export interface DataProviderSeriesWithDatapoints extends DataProviderSeries {
    data: DataLoaderDatapoints;
  }

  export interface AxisDisplayModeType {
    id: string;
    width: (axisWidth: number, numAxes: number) => number;
    toString: () => string;
  }
  export type AxisDisplayModeKeys = keyof typeof AxisDisplayMode;
  export interface AxisPlacementType {
    id: number;
    name: string;
    toString: () => string;
  }
  export type AxisPlacementKeys = keyof typeof AxisPlacement;
  /**
   * Declarations for exported constants from @cognite/griff-react
   * Important to use this constants not to brake yAxises behaviour
   */
  export const AxisDisplayMode: {
    ALL: AxisDisplayModeType;
    NONE: AxisDisplayModeType;
    COLLAPSED: AxisDisplayModeType;
  };
  export const AxisPlacement: {
    UNSPECIFIED: AxisPlacementType;
    RIGHT: AxisPlacementType;
    LEFT: AxisPlacementType;
    BOTH: AxisPlacementType;
    BOTTOM: AxisPlacementType;
    TOP: AxisPlacementType;
  };

  export interface Domain {
    start: number;
    end: number;
  }

  export interface DataProviderProps {
    onFetchData: () => void;
    defaultLoader: (
      props: DataLoaderProps
    ) => Promise<DataProviderSeriesWithDatapoints>;
    onFetchDataError: (e: Error) => void;
    pointsPerSeries: number;
    series: DataProviderSeries[];
    timeDomain: number[];
    updateInterval: number;
    collections: DataProviderCollection[];
    onUpdateDomains?: (e: any) => void;
  }

  export interface SeriesProps {
    color?: string;
    drawLines?: boolean;
    drawPoints?: boolean | PointRenderer;
    pointWidth?: number;
    strokeWidth?: number;
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
    pointWidthAccessor?: AccessorFunction;
    opacity?: number;
    opacityAccessor?: AccessorFunction;
  }

  export interface DataProviderSeries extends SeriesProps {
    id: number;
    collectionId?: number;
    yAxisPlacement?: AxisPlacementType;
    yAxisDisplayMode?: AxisDisplayModeType;
  }
  export interface DataProviderCollection extends SeriesProps {
    id: number;
    yAxisPlacement?: AxisPlacementType;
    yAxisDisplayMode?: AxisDisplayModeType;
  }

  export class DataProvider extends Component<DataProviderProps> {}

  export interface Ruler {
    visible?: boolean;
    timeLabel?: (point: GetAggregateDatapoint) => number;
    yLabel?: (point: GetAggregateDatapoint) => string;
    timestamp?: number;
    getTimeLabelPosition?: (defaultPosition: number, params: any) => number;
  }

  export interface LineChartProps {
    zoomable?: boolean;
    crosshair?: boolean;
    annotations?: Annotation[];
    contextChart?: {
      visible: boolean;
      height: number;
      isDefault: boolean;
    };
    yAxisFormatter?: (tick: number, ticks: number[]) => string;
    yAxisPlacement?: AxisPlacementType;
    xAxisHeight?: number;
    ruler?: Ruler;
    height?: number;
    width?: number;
    onMouseMove?: (e: any) => void;
    onBlur?: (e: any) => void;
    onMouseOut?: (e: any) => void;
    size?: {
      width?: number;
      height?: number;
    };
  }

  export class LineChart extends Component<LineChartProps> {}
}
