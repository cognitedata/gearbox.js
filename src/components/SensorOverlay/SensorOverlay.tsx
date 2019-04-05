import React from 'react';
import styled from 'styled-components';
import SensorTag from './SensorTag';
import EventLabel from './EventLabel';
import { VMetadata } from 'utils/validators';
import {
  Timeseries,
  SensorOverlayClickHandler,
  LinkType,
} from 'utils/validators/SensorOverlayTypes';

export const defaultStrings: VMetadata = {
  unknownValue: 'unknownValue',
};

const SensorOverlayContainer = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  pointer-events: none;
`;

const DivAutoPointerEvents = styled.div`
  pointer-events: auto;
`;

const SvgLineContainer = styled.svg<{ zIndex: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: ${({ zIndex }) => zIndex};
`;

const SvgLine = styled.line<{ color: string }>`
  stroke: ${({ color }) => color};
  stroke-width: 2;
`;

const PointContainer = styled.div<{
  left: number;
  top: number;
  zIndex: number;
}>`
  position: absolute;
  transform: translate3d(${({ left }) => left}px, ${({ top }) => top}px, 0);
  cursor: move;
  z-index: ${({ zIndex }) => zIndex};
`;

interface LabelPosition {
  left: number;
  top: number;
  pointer: {
    left: number;
    top: number;
  };
  distToCamera: number;
}

interface LabelPositionMap {
  [labelName: string]: LabelPosition;
}

export type IdType = number | string;

export interface SensorLabelConstantsMap {
  [labelName: string]: {
    description?: string;
    nodeId: number;
    color: string;
    threeDPos: { [key: string]: any };
    timeseries: Timeseries;
  };
}

interface SensorValues {
  [key: string]: number;
}

interface EventConstantsMap {
  [key: string]: {
    description: string;
    nodeId: number;
    color: string;
    threeDPos: { [key: string]: any };
  };
}

interface SensorOverlayProps {
  eventPositions: LabelPositionMap;
  eventConstants: EventConstantsMap;
  eventNames: string[];
  onClick?: SensorOverlayClickHandler;
  onLinkClick?: (link: LinkType) => void;
  onSettingsClick?: SensorOverlayClickHandler;
  sensorTagPositions: LabelPositionMap;
  sensorConstants: SensorLabelConstantsMap;
  sensorValues: SensorValues;
  sticky?: boolean;
  timeseriesNames: string[];
  strings: VMetadata;
}

class SensorOverlay extends React.Component<SensorOverlayProps> {
  static defaultProps: SensorOverlayProps = {
    sensorTagPositions: {},
    sensorConstants: {},
    sensorValues: {},
    timeseriesNames: [],
    eventPositions: {},
    eventConstants: {},
    eventNames: [],
    strings: {},
  };

  render() {
    const {
      timeseriesNames,
      sensorTagPositions,
      sensorConstants,
      sensorValues,
      eventPositions,
      eventConstants,
      eventNames,
      sticky,
    } = this.props;

    const strings: VMetadata = { ...defaultStrings, ...this.props.strings };

    return (
      <SensorOverlayContainer>
        {timeseriesNames.map(labelId => {
          const position = sensorTagPositions[labelId];

          if (position === null) {
            return '';
          }

          const { left, top, pointer } = position;
          const { timeseries, color, nodeId } = sensorConstants[labelId];

          const zIndex = Math.floor(
            Math.max(
              100 - this.props.sensorTagPositions[labelId].distToCamera * 1.2,
              1
            )
          );

          return (
            <div key={`sensor-tag-wrapper-${timeseries.name}`}>
              {this.renderPointer(zIndex, position, color)}
              <DivAutoPointerEvents>
                <SensorTag
                  timeseries={timeseries}
                  nodeId={nodeId}
                  value={sensorValues[labelId]}
                  color={color}
                  left={left}
                  top={top}
                  flipped={pointer.left > left}
                  sticky={!!sticky}
                  onClick={this.props.onClick}
                  onLinkClick={this.props.onLinkClick}
                  strings={strings}
                  zIndex={zIndex}
                  onSettingsClick={this.props.onSettingsClick}
                />
              </DivAutoPointerEvents>
            </div>
          );
        })}
        {eventNames.map(eventId => {
          const position = eventPositions[eventId];
          const { color, nodeId, description } = eventConstants[eventId];

          if (position === null) {
            return null;
          }

          const { left, top, pointer } = position;

          const zIndex = Math.floor(
            Math.max(100 - eventPositions[eventId].distToCamera * 1.2, 1)
          );

          return (
            <div key={`event-tag-wrapper-${eventId}`}>
              {this.renderPointer(zIndex, position, color)}
              <DivAutoPointerEvents>
                <EventLabel
                  description={description}
                  nodeId={nodeId}
                  color={color}
                  left={left}
                  top={top}
                  flipped={pointer.left > left}
                  onClick={this.props.onClick}
                  zIndex={zIndex}
                />
              </DivAutoPointerEvents>
            </div>
          );
        })}
      </SensorOverlayContainer>
    );
  }

  private renderPointer(
    zIndex: number,
    position: LabelPosition | undefined,
    color: string
  ) {
    if (position === undefined) {
      return null;
    }

    const { left, top, pointer } = position;

    if (left === null || pointer.left === null) {
      return null;
    }

    return (
      <React.Fragment>
        <SvgLineContainer zIndex={zIndex}>
          <g>
            <SvgLine
              x1={left + 24}
              y1={top + 24}
              x2={pointer.left + 12}
              y2={pointer.top + 12}
              color={color}
            />
          </g>
        </SvgLineContainer>
        <PointContainer left={pointer.left} top={pointer.top} zIndex={zIndex}>
          <svg width={24} height={24}>
            <circle cx={12} cy={12} r={7} fill={color} />
            <circle cx={12} cy={12} r={10} stroke={color} fill="transparent" />
          </svg>
        </PointContainer>
      </React.Fragment>
    );
  }
}

export default SensorOverlay;
