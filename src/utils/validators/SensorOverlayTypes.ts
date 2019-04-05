export interface Timeseries {
  [key: string]: any;
}

export type SensorOverlayClickHandler = (
  nodeId: number,
  timeseries?: Timeseries
) => void;

export interface LinkType {
  type: string;
  key: string;
}
