// Copyright 2020 Cognite AS
declare module '@cognite/griff-react' {
  import { DatapointAggregate, DoubleDatapoint } from '@cognite/sdk';
  import { Component } from 'react';

  export interface AxisDisplayModeType {
    id: string;
    width: (axisWidth: number, numAxes: number) => number;
    toString: () => string;
  }

  export type YAccessor = (d: DoubleDatapoint | DatapointAggregate) => number;

  export const AxisDisplayMode: {
    ALL: AxisDisplayModeType;
    NONE: AxisDisplayModeType;
    COLLAPSED: AxisDisplayModeType;
  };

  export interface Domain {
    start: number;
    end: number;
  }

  export interface Series {
    data: DatapointAggregate[];
    step: boolean;
    xAccessor: (point: DatapointAggregate) => number;
  }

  export interface DataProviderLoaderParams {
    id: number;
    timeDomain: number[];
    timeSubDomain: number[];
    pointsPerSeries: number;
    oldSeries: any;
    reason: string;
  }

  export interface DataProviderProps {
    onFetchData: () => void;
    defaultLoader: (params: DataProviderLoaderParams) => Promise<Series>;
    onFetchDataError: (e: Error) => void;
    pointsPerSeries: number;
    series: DataProviderSeries[];
    timeDomain: number[] | Domain;
    updateInterval: number;
    collections: any;
  }

  export interface DataProviderSeries {
    id: number;
    color?: string;
    yAxisDisplayMode?: AxisDisplayModeType;
    hidden?: boolean;
    yAccessor?: YAccessor;
    y0Accessor?: YAccessor;
    y1Accessor?: YAccessor;
    ySubDomain?: [number, number];
  }

  export class DataProvider extends Component<DataProviderProps> {}

  export interface Annotation {
    assetIds: number[];
    color: string;
    description: string;
    endTime: number;
    eventSubType: string;
    eventType: string;
    id: number;
    key: string;
    ruleId: string;
    startTime: number;
  }

  export interface AxisPlacementType {
    id: number;
    name: string;
    toString: () => string;
  }

  export const AxisPlacement: {
    UNSPECIFIED: AxisPlacementType;
    RIGHT: AxisPlacementType;
    LEFT: AxisPlacementType;
    BOTH: AxisPlacementType;
    BOTTOM: AxisPlacementType;
    TOP: AxisPlacementType;
  };

  export interface Annotation {
    data: number[];
    height: number;
    id: number;
    color: string;
    fillOpacity: number;
    xScale: any;
  }

  export interface Ruler {
    visible?: boolean;
    timeLabel?: (point: DatapointAggregate) => number;
    yLabel?: (point: DatapointAggregate) => string;
    timestamp?: number;
    getTimeLabelPosition?: (defaultPosition: number, params: any) => number;
  }

  export interface LineChartProps {
    zoomable?: boolean;
    crosshair?: boolean;
    annotations: Annotation[];
    contextChart?: {
      visible: boolean;
      height: number;
      isDefault: boolean;
    };
    yAxisFormatter?: (tick: number, ticks: number[]) => string;
    yAxisPlacement: AxisPlacementType;
    xAxisHeight?: number;
    ruler?: Ruler;
    height?: number;
    width?: number;
    onMouseMove?: (e: any) => void;
    onBlur?: (e: any) => void;
    onMouseOut?: (e: any) => void;
  }

  export class LineChart extends React.Component<LineChartProps> {}
}
