import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  DropTarget,
  DragDropContext,
  DropTargetConnector,
  DropTargetMonitor,
  ConnectDropTarget,
  DropTargetSpec,
} from 'react-dnd';
import { withSize } from 'react-sizeme';
import { Datapoint } from '@cognite/sdk';
import { omit } from 'lodash';
import { DragTargets } from './constants';
import DraggableBox from './DraggableBox';
import DraggablePoint from './DraggablePoint';
import SvgLine from './SvgLine';
import { clampNumber } from '../../utils';

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

interface DraggableBoxPosition extends SensorPosition {
  id: number;
}

interface SensorOverlayProps {
  children: any;
  timeserieIds: number[];
  colorMap: {
    [id: string]: string;
  };
  defaultPositionMap: {
    [id: string]: SensorPosition;
  };
  linksMap: {
    [id: string]: boolean;
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
}

interface SensorOverlayState {
  timeserieIds: number[]; // reference to timeserieIds in props
  boxes: DraggableBoxPosition[];
  prevSize: {
    width: number;
    height: number;
  };
}

export class SensorOverlay extends Component<
  SensorOverlayProps,
  SensorOverlayState
> {
  static defaultProps: Partial<SensorOverlayProps> = {
    isTagDraggable: true,
    isPointerDraggable: true,
  };

  static getDerivedStateFromProps(
    props: SensorOverlayProps,
    state: SensorOverlayState
  ) {
    if (
      props.timeserieIds !== state.timeserieIds ||
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
    if (props.size.width === 0 || props.size.height === 0) {
      // container is empty
      return {
        timeserieIds: props.timeserieIds,
        boxes: [],
        prevSize: {
          width: props.size.width,
          height: props.size.height,
        },
      };
    }
    let defaultsCounter = 0;
    const boxes = props.timeserieIds.map(id => {
      const oldBox = state.boxes.find(box => box.id === id);
      return {
        id,
        ...(oldBox
          ? oldBox
          : props.defaultPositionMap && props.defaultPositionMap[id.toString()]
          ? props.defaultPositionMap[id.toString()]
          : {
              // default position of tag and pointer
              left: (100 + defaultsCounter * 40) / props.size.width,
              top: (40 + defaultsCounter * 20) / props.size.height,
              pointer: {
                left: (200 + defaultsCounter * 40) / props.size.width,
                top: (140 + defaultsCounter++ * 20) / props.size.height,
              },
            }),
      };
    });
    return {
      timeserieIds: props.timeserieIds,
      boxes,
      prevSize: {
        width: props.size.width,
        height: props.size.height,
      },
    };
  }

  previousDelta = { x: 0, y: 0 };

  constructor(props: SensorOverlayProps) {
    super(props);
    this.state = SensorOverlay.getNewStateFromProps(props, {
      timeserieIds: [],
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
        this.props.onSensorPositionChange(id, omit(box, 'id'));
      }
    }
  };

  render() {
    const { size, fixedWidth } = this.props;
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
          const color =
            (this.props.colorMap && this.props.colorMap[box.id]) || 'red'; // red is default
          return (
            <React.Fragment key={box.id}>
              <DraggableBox
                id={box.id}
                left={box.left * size.width}
                top={box.top * size.height}
                color={color}
                sticky={false}
                onLinkClick={
                  this.props.linksMap ? this.props.onLinkClick : undefined
                }
                isDraggable={this.props.isTagDraggable}
                flipped={box.pointer.left > box.left}
                onDragHandleDoubleClick={this.onDragHandleDoubleClick}
                onClick={this.props.onClick}
                onSettingsClick={this.props.onSettingsClick}
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

export const SizeWrapper = withSize({ monitorHeight: true })(
  WrappedSensorOverlay
);

const FinalSensorOverlay = DragDropContext(HTML5Backend)(SizeWrapper);

FinalSensorOverlay.displayName = 'SensorOverlay';

export default FinalSensorOverlay;
