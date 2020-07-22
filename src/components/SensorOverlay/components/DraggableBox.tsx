// Copyright 2020 Cognite AS
import { CogniteClient, Datapoints, Timeseries } from '@cognite/sdk';
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
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../../context/clientSDKProxyContext';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../../../utils/promise';
import { ComplexString } from '../../common/ComplexString/ComplexString';
import { DragTargets } from '../constants';
import { Datapoint, SensorMinMaxRange } from '../interfaces';
import StyledOdometer from './StyledOdometer';

export const defaultStrings = {
  underPercentage: '{{ percent }}% under the set limit of {{ min }}',
  overPercentage: '{{ percent }}% over the set limit of {{ max }}',
};

const HELLIP = String.fromCharCode(0x02026);

const handleStyles = {
  width: 25,
  height: 25,
  borderRadius: '100%',
  margin: 'auto 8px',
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
  minMaxRange?: SensorMinMaxRange;
  strings: { [key: string]: string };
  alertColor: string;
}

interface DraggableBoxState {
  tag: Timeseries | null;
  dataPoint: Datapoint | null;
  hovering: boolean;
}

export class DraggableBox
  extends Component<DraggableBoxProps, DraggableBoxState>
  implements ComponentWithUnmountState {
  static defaultProps = {
    hovering: false,
    color: '',
    flipped: false,
    min: null,
    max: null,
    sticky: false,
    isDraggable: true,
    refreshInterval: 5000, // update datapoint every five seconds
    strings: defaultStrings,
    alertColor: '#e74c3c',
  };

  static contextType = ClientSDKProxyContext;
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  isComponentUnmounted = false;

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
    // DraggableBox is only used inside SensorOverlay
    this.client = this.context('SensorOverlay')!;

    if (!this.client) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
    this.fetchTimeSeries(this.props.id);
    this.updateValue();
    this.interval = setInterval(this.updateValue, this.props.refreshInterval);
  }

  componentWillUnmount() {
    this.isComponentUnmounted = true;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  componentDidUpdate(nextProps: DraggableBoxProps) {
    if (this.props.id !== nextProps.id) {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.fetchTimeSeries(nextProps.id);
      this.updateValue();
      this.interval = setInterval(this.updateValue, this.props.refreshInterval);
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
    try {
      const timeseries = await connectPromiseToUnmountState(
        this,
        this.client.timeseries.retrieve([{ id }])
      );
      if (timeseries.length !== 1) {
        console.error(ERROR_API_UNEXPECTED_RESULTS);
        return;
      }
      this.setState({
        tag: timeseries[0],
      });
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
  };

  updateValue = async () => {
    try {
      const datapoints: Datapoints[] = await connectPromiseToUnmountState(
        this,
        this.client.datapoints.retrieveLatest([
          { id: this.props.id, before: 'now' },
        ])
      );
      if (!datapoints || datapoints.length !== 1) {
        this.setState({
          dataPoint: null,
        });
        return;
      }
      const datapoint = datapoints[0];
      if (!datapoint.datapoints || datapoint.datapoints.length === 0) {
        this.setState({
          dataPoint: null,
        });
        console.error(ERROR_API_UNEXPECTED_RESULTS);
        return;
      }
      if (
        this.state.dataPoint &&
        datapoint.datapoints[0].timestamp < this.state.dataPoint.timestamp
      ) {
        return; // got old data point - skip it
      }
      this.setState({
        dataPoint: {
          isString: datapoint.isString,
          value: datapoint.datapoints[0].value,
          timestamp: datapoint.datapoints[0].timestamp,
        },
      });
    } catch (error) {
      if (error instanceof CanceledPromiseException !== true) {
        throw error;
      }
    }
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

  isValid = () => {
    const { minMaxRange } = this.props;
    const { dataPoint } = this.state;
    if (!dataPoint || typeof dataPoint.value !== 'number' || !minMaxRange) {
      return true;
    } else {
      return !(
        (minMaxRange.min && dataPoint.value < minMaxRange.min) ||
        (minMaxRange.max && dataPoint.value > minMaxRange.max)
      );
    }
  };

  getPercentDiff = (): React.ReactNode => {
    const { strings } = this.props;
    const { min, max } = this.props.minMaxRange!;
    const { value } = this.state.dataPoint!;
    if (typeof value !== 'number') {
      return '';
    }
    if (min !== undefined && value < min) {
      const percent = (((min - value) / min) * 100).toFixed(2);
      return (
        <ComplexString
          input={strings.underPercentage}
          percent={percent}
          min={min}
        />
      );
    }
    if (max !== undefined && value > max) {
      const percent = (((value - max) / max) * 100).toFixed(2);
      return (
        <ComplexString
          input={strings.overPercentage}
          percent={percent}
          max={max}
        />
      );
    }
    return '';
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
                backgroundColor: this.isValid()
                  ? 'white'
                  : this.props.alertColor,
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

  renderError() {
    const { hovering } = this.state;
    const { alertColor, color, sticky, flipped } = this.props;
    return !this.isValid() ? (
      <TagError
        alertColor={alertColor}
        color={color}
        className={`${hovering || sticky ? 'hovering' : ''} ${
          flipped ? 'flipped' : ''
        }`}
        data-test-id={'tag-error'}
      >
        {this.getPercentDiff()}
      </TagError>
    ) : null;
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
        {this.renderError()}
        {this.renderTag()}
      </div>
    );
  }
}

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

const TagError = styled.div<{ alertColor: string }>`
  color: white;
  position: absolute;
  top: 100%;
  opacity: 1;
  align-items: center;
  font-size: 0.7rem;
  padding: 6px 12px;
  margin-top: 6px;
  white-space: nowrap;
  border-radius: 30px;
  background-color: ${({ alertColor }) => alertColor};
  transition: 0.3s margin-right, 0.3s opacity, 0.3s margin-bottom;
  opacity: 0;
  right: auto;
  margin-right: 0;
  margin-top: 6px;

  & > p {
    margin: 2px;
  }

  &.hovering {
    opacity: 1;
    margin-top: 10;
  }
  &.flipped {
    transform: rotate(180deg);
    margin-right: -42px;
  }
`;

export default DragSource(
  DragTargets.Point,
  boxSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })
)(DraggableBox);
