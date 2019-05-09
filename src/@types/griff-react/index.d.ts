declare module '@cognite/griff-react' {
  import {
    DataDatapoints,
    Datapoint,
    Timeseries,
    TimeseriesWithCursor,
  } from '@cognite/sdk';

  export interface AxisDisplayModeType {
    id: string;
    width: (axisWidth: number, numAxes: number) => number;
    toString: () => string;
  }

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
    data: Datapoint[];
    step: boolean;
    xAccessor: (point: Datapoint) => number;
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
    series: any;
    timeDomain: number[] | Domain;
    updateInterval: number;
  }

  export class DataProvider extends React.Component<DataProviderProps> {}

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
    timeLabel?: (point: Datapoint) => number;
    yLabel?: (point: Datapoint) => string;
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
    ruler: Ruler;
    onMouseMove?: (e: any) => void;
    onBlur?: (e: any) => void;
    onMouseOut?: (e: any) => void;
  }

  export class LineChart extends React.Component<LineChartProps> {}
}
