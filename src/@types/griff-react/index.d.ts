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

  export interface LineChartProps {
    zoomable?: boolean;
    crosshair?: boolean;
    contextChart?: {
      visible: boolean;
      height: number;
      isDefault: boolean;
    };
    yAxisFormatter?: (tick: number, ticks: number[]) => string;
  }

  export class LineChart extends React.Component<LineChartProps> {}
}
