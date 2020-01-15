import { ReactNode } from 'react';
import { ConnectDropTarget } from 'react-dnd';

export interface SensorPosition {
  left: number;
  top: number;
  pointer: {
    left: number;
    top: number;
  };
}

export type SensorDatapoint = Datapoint;

export interface SensorMinMaxRange {
  min?: number;
  max?: number;
}

export interface Datapoint {
  isString: boolean;
  value: number | string;
  timestamp: Date;
}

export interface SensorOverlayProps {
  /**
   * List of timeserie Ids
   */
  timeseriesIds: number[];
  /**
   * Wrapped content. Usually infographic image
   */
  children: ReactNode;
  /**
   * Number in milliseconds that defines refresh interval for fetching latest timeserie data
   */
  refreshInterval?: number;
  /**
   * Object map that defines custom colors for timeseries
   */
  colorMap: {
    [id: string]: string;
  };
  /**
   * @ignore
   */
  connectDropTarget: ConnectDropTarget;
  /**
   * Object map that defines position of newly added sensors in timeseriesIds.
   * The map doesn't affect position of previously added or dragged sensors.
   */
  defaultPositionMap: {
    [id: string]: SensorPosition;
  };
  /**
   * Object map that defines if it's needed to wrap timeserie values in the anchor tag <a>,
   * works in conjunction with onLinkClick
   */
  linksMap: {
    [id: string]: boolean;
  };
  /**
   * Object map that defines which timeseries will show tooltips with name and description without mouse hovering
   */
  stickyMap: {
    [id: string]: boolean;
  };
  /**
   * Object map that defines a normal range for sensor values and once the value is out of this range an alert bar will be shown
   */
  minMaxMap: {
    [id: string]: SensorMinMaxRange;
  };
  /**
   * @ignore
   */
  size: {
    width: number;
    height: number;
  };
  /**
   * Works in conjuction with minMaxMap.
   * Defines background color of the alert tooltip that is shown if sensor value is out of min/max range.
   * The dragdable circle in the tag should also have the alert color if the sensor value is out of range.
   */
  alertColor?: string;
  /**
   * Defines whether it's possible to drag sensor boxes (tags)
   */
  isTagDraggable: boolean;
  /**
   * Defines whether it's possible to drag sensor pointers
   */
  isPointerDraggable: boolean;
  /**
   * Function triggered when user clicks on a sensor box or pointer
   */
  onClick?: (id: number) => void;
  /**
   * Function triggered when user clicks on the settings icon. The icon is shown if this prop is defined.
   */
  onSettingsClick?: (id: number) => void;
  /**
   * Function triggered when user clicks on a sensor value link. The link should be enabled with linksMap
   */
  onLinkClick?: (id: number, dataPoint?: Datapoint) => void;
  /**
   * Function triggered when either a tag or a pointer has been dragged.
   */
  onSensorPositionChange?: (id: number, position: SensorPosition) => void;
  /**
   * By default SensorOverlay takes 100% width in current block context
   * but if fixedWidth is given the width will be fixed by the number in pixels
   */
  fixedWidth?: number;
  /**
   * Object map with strings to customize/localize text in the component
   */
  strings?: { [key: string]: string };
}
