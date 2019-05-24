import { Datapoint } from '@cognite/sdk';
import { omit, sortedIndex } from 'lodash';
import React, { Component } from 'react';
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
import { clampNumber, getColorByString } from '../../utils';
import DraggableBox from './components/DraggableBox';
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
  children: React.ReactNode;
  timeseriesIds: number[];
  alertColor?: string;
  colorMap: {
    [id: string]: string;
  };
  defaultPositionMap: {
    [id: string]: SensorPosition;
  };
  linksMap: {
    [id: string]: boolean;
  };
  stickyMap: {
    [id: string]: boolean;
  };
  minMaxMap: {
    [id: string]: SensorMinMaxRange;
  };
  isTagDraggable: boolean;
  isPointerDraggable: boolean;
  onSensorPositionChange?: (id: number, position: SensorPosition) => void;
  onSettingsClick?: (id: number) => void;
  onClick?: (id: number) => void;
  onLinkClick?: (id: number, dataPoint?: Datapoint) => void;
  connectDropTarget: ConnectDropTarget;
  size: {
    width: number;
    height: number;
  };
  fixedWidth?: number;
  refreshInterval?: number;
  strings?: { [key: string]: string };
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
