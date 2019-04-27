import * as sdk from '@cognite/sdk';
import { Datapoint, Timeseries } from '@cognite/sdk';
import { Icon } from 'antd';
import numeral from 'numeral';
import React, { Component } from 'react';
import {
  ConnectDragPreview,
  ConnectDragSource,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
} from 'react-dnd';
import Odometer from 'react-odometerjs';
import styled from 'styled-components';
import { DragTargets } from '../constants';
import StyledOdometer from './StyledOdometer';

const HELLIP = String.fromCharCode(0x02026);

export const Link = styled.a`
  color: 'white';
  display: 'inherit';
`;
export const Tag = styled.div`
  background: ${props => props.color};
  border-radius: 30px;
  color: white;
  display: flex;
  white-space: nowrap;
  padding: 6px 4px;
  transition: 0.3s all;
  transform-origin: 24px 50%;
  @media screen and (max-width: 1000px) {
    transform: scale(0.75);
  }
`;
const TagValue = styled.div`
  font-size: 1.4rem;
  display: flex;
  position: relative;
  top: -2px;
`;
const TagUnit = styled.div`
  opacity: 0.8;
  font-size: 0.8rem;
  margin: 4px;
`;
const TagSettings = styled.div`
  color: white;
  font-size: 1.1rem;
  margin: auto 8px;
  cursor: pointer;
  padding-right: 4px;
`;
export const TagName = styled.div`
  color: white;
  position: absolute;
  bottom: 100%;
  margin-bottom: 0;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 30px;
  background: ${props => props.color};
  transition: 0.3s margin-right, 0.3s opacity, 0.3s margin-bottom;
  opacity: 0;
  right: auto;
  margin-right: 0;
  pointer-events: none;

  &.hovering {
    opacity: 1;
    margin-bottom: 4px;
  }
  &.flipped {
    transform: rotate(180deg);
    margin-right: -42px;
  }
`;
const TagDescription = styled.div`
  color: white;
  position: absolute;
  bottom: 100%;
  font-size: 0.7rem;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 30px;
  background: ${props => props.color};
  transition: 0.3s margin-right, 0.3s opacity, 0.3s margin-bottom;
  opacity: 0;
  margin-bottom: 36px;
  right: auto;
  margin-right: 0;
  pointer-events: none;

  &.hovering {
    opacity: 1;
    margin-bottom: 40px;
  }
  &.flipped {
    transform: rotate(180deg);
    margin-right: -42px;
  }
`;

const handleStyles = {
  width: 25,
  height: 25,
  borderRadius: '100%',
  margin: 'auto 8px',
  backgroundColor: 'white',
  cursor: 'move',
  transform: 'translate(0, 0)',
  transition: '.5s background',
};

const boxSource = {
  beginDrag(props: DraggableBoxProps) {
    const { id, left, top } = props;
    return { id, left, top, type: 'box' };
  },
};

const flipStyle: React.CSSProperties = {
  transform: 'rotate(180deg)',
  top: '2px',
};

interface DragSourceProps {
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
  isDragging: boolean;
}

interface DraggableBoxProps extends DragSourceProps {
  id: number; // timeserie Id
  onClick?: (tsId: number) => void;
  onLinkClick?: (tsId: number, dataPoint?: Datapoint) => void;
  onSettingsClick?: (tsId: number) => void;
  onDragHandleDoubleClick: (tsId: number) => void;
  isDraggable: boolean;
  flipped: boolean;
  left: number;
  top: number;
  color: string;
  sticky?: boolean;
  refreshInterval: number; // milliseconds
}

interface DraggableBoxState {
  tag: Timeseries | null;
  dataPoint: Datapoint | null;
  hovering: boolean;
}

export class DraggableBox extends Component<
  DraggableBoxProps,
  DraggableBoxState
> {
  static defaultProps = {
    hovering: false,
    color: '',
    flipped: false,
    min: null,
    max: null,
    sticky: false,
    isDraggable: true,
    refreshInterval: 5000, // update datapoint every five seconds
  };

  private isComponentUnmounted = false;

  private interval: number | null = null;

  constructor(props: DraggableBoxProps) {
    super(props);
    this.state = {
      hovering: false,
      tag: null,
      dataPoint: null,
    };
  }

  componentDidMount() {
    this.fetchTimeSeries(this.props.id);
  }

  componentWillUnmount() {
    this.isComponentUnmounted = true;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate(nextProps: DraggableBoxProps) {
    if (this.props.id !== nextProps.id) {
      this.fetchTimeSeries(nextProps.id);
    }
  }

  onMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.setState({
      hovering: true,
    });
  };

  onMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.setState({
      hovering: false,
    });
  };

  onDragHandleDoubleClick = () => {
    const { onDragHandleDoubleClick, id } = this.props;
    if (onDragHandleDoubleClick) {
      onDragHandleDoubleClick(id);
    }
  };

  fetchTimeSeries = async (id: number) => {
    const timeserie = await sdk.TimeSeries.retrieve(id, true);
    if (this.isComponentUnmounted) {
      return;
    }
    this.setState({
      tag: timeserie,
    });
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.updateValue();
    this.interval = setInterval(this.updateValue, this.props.refreshInterval);
  };

  updateValue = async () => {
    const data = await sdk.Datapoints.retrieveLatest(this.state.tag!.name);
    if (this.isComponentUnmounted) {
      return;
    }
    if (!data) {
      this.setState({
        dataPoint: null,
      });
      return;
    }
    if (
      this.state.dataPoint &&
      data.timestamp < this.state.dataPoint.timestamp
    ) {
      return; // got old data point - skip it
    }
    this.setState({
      dataPoint: data,
    });
  };

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  };

  handleSettingsClick = (e: React.MouseEvent) => {
    if (this.props.onSettingsClick) {
      e.stopPropagation();
      this.props.onSettingsClick(this.props.id);
    }
  };

  handleLinkClick = (e: React.MouseEvent) => {
    if (this.props.onLinkClick) {
      e.stopPropagation();
      this.props.onLinkClick(this.props.id, this.state.dataPoint || undefined);
    }
  };

  renderValue() {
    const { value } = this.state.dataPoint || { value: undefined };
    if (value === undefined) {
      return HELLIP;
    }
    if (Number.isNaN(+value)) {
      return value;
    }
    return (
      <StyledOdometer key="odometer">
        <Odometer
          value={numeral(+value).format('0,0.[000000]')}
          duration={250}
        />
      </StyledOdometer>
    );
  }

  renderTag() {
    const valueComponent = this.renderValue();
    const { unit } = this.state.tag || { unit: undefined };

    return (
      <Tag
        color={this.props.color}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.handleClick}
      >
        {this.props.isDraggable &&
          this.props.connectDragSource(
            <div
              style={{
                ...handleStyles,
              }}
              onDoubleClick={this.onDragHandleDoubleClick}
            />
          )}

        <TagValue style={this.props.flipped ? flipStyle : {}}>
          {this.props.onLinkClick ? (
            <Link
              style={{
                color: 'white',
                display: 'inherit',
              }}
              onClick={this.handleLinkClick}
            >
              {valueComponent}
              {unit && <TagUnit>{unit}</TagUnit>}
            </Link>
          ) : (
            <React.Fragment>
              {valueComponent}
              {unit && <TagUnit key="unit">{unit}</TagUnit>}
            </React.Fragment>
          )}
        </TagValue>
        {this.props.onSettingsClick ? (
          <TagSettings onClick={this.handleSettingsClick}>
            <Icon type="setting" />
          </TagSettings>
        ) : (
          <div style={{ width: 16, height: 16 }} />
        )}
      </Tag>
    );
  }

  render() {
    const { left, top, color, flipped, isDragging, sticky } = this.props;
    const { description, name } = this.state.tag || {
      description: undefined,
      name: undefined,
    };
    const { hovering } = this.state;

    if (isDragging) {
      return null;
    }

    return (
      <div
        style={{
          position: 'absolute',
          transition: 'transform .3s',
          left,
          top,
          transform: `translate3d(-24px, -24px, 0) rotate(${
            flipped ? '180' : '0'
          }deg)`,
          transformOrigin: '24px 50%',
          zIndex: hovering ? 1000 : 999,
          pointerEvents: 'auto',
        }}
      >
        {name && (
          <TagName
            color={color}
            className={`${hovering || sticky ? 'hovering' : ''} ${
              flipped ? 'flipped' : ''
            }`}
          >
            {name}
          </TagName>
        )}
        {description && (
          <TagDescription
            color={color}
            className={`${hovering || sticky ? 'hovering' : ''} ${
              flipped ? 'flipped' : ''
            }`}
          >
            {description}
          </TagDescription>
        )}
        {this.renderTag()}
      </div>
    );
  }
}

export default DragSource(
  DragTargets.Point,
  boxSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })
)(DraggableBox);
