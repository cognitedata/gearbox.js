import { omit, sortedIndex } from 'lodash';
import React, { Component, ReactNode } from 'react';
import {
  ConnectDropTarget,
  DragDropContext,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withSize } from 'react-sizeme';
import { getColorByString } from '../../utils/colors';
import { clampNumber } from '../../utils/utils';
import DraggableBox, { Datapoint } from './components/DraggableBox';
import DraggablePoint from './components/DraggablePoint';
import SvgLine from './components/SvgLine';
import { DragTargets } from './constants';

const boxTarget: DropTargetSpec<SensorOverlayProps> = {
  hover(
    props: SensorOverlayProps,
    monitor: DropTargetMonitor,
    component: SensorOverlay
  ) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    if (
      delta &&
      (delta.x !== component.previousDelta.x ||
        delta.y !== component.previousDelta.y)
    ) {
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      component.previousDelta = delta;
      const { size } = props;
      if (item.type === 'box') {
        component.moveBox(
          item.id,
          clampNumber(left, 0, size.width - 1),
          clampNumber(top, 0, size.height - 1)
        );
      } else if (item.type === 'point') {
        component.movePoint(
          item.id,
          clampNumber(left, 0, size.width - 1),
          clampNumber(top, 0, size.height - 1)
        );
      }
    }
  },
  /**
   * if props.onSensorPositionChange is defined - notify parent about sensor position change
   */
  drop(
    props: SensorOverlayProps,
    monitor: DropTargetMonitor,
    component: SensorOverlay
  ) {
    if (props.onSensorPositionChange) {
      const item = monitor.getItem();
      component.notifyParentOnPositionChange(item.id);
    }
  },
};

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

interface DraggableBoxPosition extends SensorPosition {
  id: number;
  defaultSlot: number | null;
  color: string;
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
  connectDropTarget: ConnectDropTarget;
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
  size: {
    width: number;
    height: number;
  };
}

interface SensorOverlayState {
  timeseriesIds: number[]; // reference to timeseriesIds in props
  boxes: DraggableBoxPosition[];
  prevSize: {
    width: number;
    height: number;
  };
}

class SensorOverlay extends Component<SensorOverlayProps, SensorOverlayState> {
  static defaultProps: Partial<SensorOverlayProps> = {
    isTagDraggable: true,
    isPointerDraggable: true,
  };

  static getDerivedStateFromProps(
    props: SensorOverlayProps,
    state: SensorOverlayState
  ) {
    if (
      props.timeseriesIds !== state.timeseriesIds ||
      props.size.width !== state.prevSize.width ||
      props.size.height !== state.prevSize.height
    ) {
      return SensorOverlay.getNewStateFromProps(props, state);
    } else {
      return null;
    }
  }

  static getNewStateFromProps(
    props: SensorOverlayProps,
    state: SensorOverlayState
  ): SensorOverlayState {
    return props.size.width === 0 || props.size.height === 0
      ? {
          // container is empty
          timeseriesIds: props.timeseriesIds,
          boxes: [],
          prevSize: {
            width: props.size.width,
            height: props.size.height,
          },
        }
      : {
          timeseriesIds: props.timeseriesIds,
          boxes: SensorOverlay.makeBoxesList(state.boxes, props),
          prevSize: {
            width: props.size.width,
            height: props.size.height,
          },
        };
  }

  static makeBoxesList(
    oldBoxes: DraggableBoxPosition[],
    props: SensorOverlayProps
  ): DraggableBoxPosition[] {
    const closedSlots: number[] = oldBoxes
      .map(box => box.defaultSlot)
      .filter((v): v is number => typeof v === 'number')
      .sort((a: number, b: number) => a - b);

    return props.timeseriesIds.map(id => {
      const oldBox = oldBoxes.find(box => box.id === id);
      if (oldBox) {
        return oldBox;
      } else {
        const isDefaultPositionProvided = !!(
          props.defaultPositionMap && props.defaultPositionMap[id]
        );
        const defaultSlot: number | null = isDefaultPositionProvided
          ? null
          : SensorOverlay.findFirstFreeSlot(closedSlots);
        if (typeof defaultSlot === 'number') {
          closedSlots.splice(
            sortedIndex(closedSlots, defaultSlot),
            0,
            defaultSlot
          );
        }
        return {
          id,
          defaultSlot,
          color:
            (props.colorMap && props.colorMap[id]) ||
            getColorByString(id.toString()),
          ...(isDefaultPositionProvided
            ? props.defaultPositionMap[id]
            : SensorOverlay.getDefaultPosition(
                defaultSlot as number,
                props.size
              )),
        };
      }
    });
  }

  static findFirstFreeSlot(closedSlots: number[]): number {
    let freeSlot = 0;
    for (const slot of closedSlots) {
      if (slot !== freeSlot) {
        return freeSlot;
      } else {
        freeSlot++;
      }
    }
    return freeSlot;
  }

  static getDefaultPosition(
    defaultsSlot: number,
    size: { width: number; height: number }
  ): SensorPosition {
    return {
      // default position of tag and pointer
      left: (100 + defaultsSlot * 40) / size.width,
      top: (40 + defaultsSlot * 20) / size.height,
      pointer: {
        left: (200 + defaultsSlot * 40) / size.width,
        top: (140 + defaultsSlot * 20) / size.height,
      },
    };
  }

  previousDelta = { x: 0, y: 0 };

  constructor(props: SensorOverlayProps) {
    super(props);
    this.state = SensorOverlay.getNewStateFromProps(props, {
      timeseriesIds: [],
      boxes: [],
      prevSize: {
        width: 0,
        height: 0,
      },
    });
  }

  onDragHandleDoubleClick = (timeserieId: number) => {
    const box = this.state.boxes.find(b => b.id === timeserieId);
    if (box) {
      const { size } = this.props;
      const newPosition = {
        left: box.left * size.width + 50,
        top: box.top * size.height + 50,
      };
      this.movePoint(timeserieId, newPosition.left, newPosition.top, true);
    }
  };

  onAnchorDoubleClick = (timeserieId: number) => {
    const box = this.state.boxes.find(b => b.id === timeserieId);
    if (box) {
      const { pointer } = box;
      const { size } = this.props;
      const newPosition = {
        left: Math.max(20, pointer.left * size.width - 50),
        top: Math.max(20, pointer.top * size.height - 50),
      };
      this.moveBox(timeserieId, newPosition.left, newPosition.top, true);
    }
  };

  moveBox = (
    id: number,
    left: number,
    top: number,
    notifyParent: boolean = false
  ) => {
    this.setState(
      (state: SensorOverlayState, props: SensorOverlayProps) => {
        return {
          boxes: state.boxes.map(box =>
            box.id === id
              ? {
                  ...box,
                  defaultSlot: null,
                  left: left / props.size.width,
                  top: top / props.size.height,
                }
              : box
          ),
        };
      },
      () => notifyParent && this.notifyParentOnPositionChange(id)
    );
  };

  movePoint = (
    id: number,
    left: number,
    top: number,
    notifyParent: boolean = false
  ) => {
    this.setState(
      (state: SensorOverlayState, props: SensorOverlayProps) => {
        return {
          boxes: state.boxes.map(box =>
            box.id === id
              ? {
                  ...box,
                  pointer: {
                    left: left / props.size.width,
                    top: top / props.size.height,
                  },
                }
              : box
          ),
        };
      },
      () => notifyParent && this.notifyParentOnPositionChange(id)
    );
  };

  notifyParentOnPositionChange = (id: number) => {
    if (this.props.onSensorPositionChange) {
      const box = this.state.boxes.find(b => b.id === id);
      if (box) {
        this.props.onSensorPositionChange(id, omit(box, ['id', 'defaultSlot']));
      }
    }
  };

  render() {
    const {
      size,
      fixedWidth,
      colorMap,
      stickyMap,
      minMaxMap,
      refreshInterval,
      strings,
      alertColor,
    } = this.props;
    return this.props.connectDropTarget(
      <div
        style={{
          position: 'relative',
          display: 'block',
          width: fixedWidth || '100%',
          pointerEvents: 'auto',
        }}
      >
        {this.props.children}
        {this.state.boxes.map(box => {
          const color: string = (colorMap && colorMap[box.id]) || box.color;
          return (
            <React.Fragment key={box.id}>
              <DraggableBox
                id={box.id}
                alertColor={alertColor}
                left={box.left * size.width}
                top={box.top * size.height}
                color={color}
                sticky={(stickyMap && stickyMap[box.id]) || false}
                onLinkClick={
                  this.props.linksMap ? this.props.onLinkClick : undefined
                }
                isDraggable={this.props.isTagDraggable}
                flipped={box.pointer.left > box.left}
                onDragHandleDoubleClick={this.onDragHandleDoubleClick}
                onClick={this.props.onClick}
                onSettingsClick={this.props.onSettingsClick}
                refreshInterval={refreshInterval}
                minMaxRange={minMaxMap && minMaxMap[box.id]}
                strings={strings}
              />
              <SvgLine
                box={{
                  color,
                  left: box.left * size.width,
                  top: box.top * size.height,
                  pointer: {
                    left: box.pointer.left * size.width,
                    top: box.pointer.top * size.height,
                  },
                }}
              />
              <DraggablePoint
                id={box.id}
                left={box.pointer.left * size.width}
                top={box.pointer.top * size.height}
                color={color}
                isDraggable={this.props.isPointerDraggable}
                onClick={this.props.onClick}
                onDragHandleDoubleClick={this.onAnchorDoubleClick}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

const WrappedSensorOverlay = DropTarget(
  [DragTargets.Box, DragTargets.Point],
  boxTarget,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(SensorOverlay);

const SizeWrapper = withSize({ monitorHeight: true })(WrappedSensorOverlay);

const FinalSensorOverlay = DragDropContext(HTML5Backend)(SizeWrapper);

FinalSensorOverlay.displayName = 'SensorOverlay';

export { FinalSensorOverlay as SensorOverlay };

export { SensorOverlay as SensorOverlayWithoutCustomize };
