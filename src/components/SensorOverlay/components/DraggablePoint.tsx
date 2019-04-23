import React, { Component } from 'react';
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  ConnectDragSource,
  ConnectDragPreview,
} from 'react-dnd';
import { DragTargets } from '../constants';

const boxSource = {
  beginDrag(props: DraggablePointProps) {
    const { id, left, top } = props;
    return { id, left, top, type: 'point' };
  },
};

interface DragSourceProps {
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
  isDragging: boolean;
}

interface DraggablePointProps extends DragSourceProps {
  onClick?: (id: number) => void;
  onDragHandleDoubleClick: (tsId: number) => void;
  id: number;
  isDraggable: boolean;
  left: number;
  top: number;
  color: string;
}

export class DraggablePoint extends Component<DraggablePointProps> {
  handleOnClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  };

  onDragHandleDoubleClick = () => {
    const { onDragHandleDoubleClick, id } = this.props;
    if (onDragHandleDoubleClick) {
      onDragHandleDoubleClick(id);
    }
  };

  render() {
    const {
      left,
      top,
      connectDragSource,
      connectDragPreview,
      isDragging,
      isDraggable,
      color,
    } = this.props;

    if (isDragging) {
      return null;
    }

    return connectDragPreview(
      connectDragSource(
        <div
          style={{
            position: 'absolute',
            left,
            top,
            transform: `translate3d(-12px, -12px, 0)`,
            cursor: isDraggable ? 'move' : 'auto',
            pointerEvents: isDraggable ? 'auto' : 'none',
          }}
          onClick={this.handleOnClick}
          onDoubleClick={this.onDragHandleDoubleClick}
        >
          <svg width={24} height={24}>
            <circle cx={12} cy={12} r={7} fill={color} />
            <circle cx={12} cy={12} r={10} stroke={color} fill="transparent" />
          </svg>
        </div>
      )
    );
  }
}

export default DragSource(
  DragTargets.Box,
  boxSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })
)(DraggablePoint);
