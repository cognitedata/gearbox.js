import { ScaleTime } from 'd3-scale';
import React from 'react';
import styled from 'styled-components';

export enum EventTimelineType {
  discrete = 'discrete',
  continuous = 'continuous',
}

export enum EventTimelineView {
  fill = 'fill',
  outline = 'outline',
}

export interface EventProps {
  color: string;
  scale: ScaleTime<number, number>;
  start: number | Date;
  end?: number | Date;
  type?: EventTimelineType;
  view?: EventTimelineView;
  discreteWidth?: number;
  height?: number;
}

export const Event: React.FC<EventProps> = props => {
  const {
    scale,
    start,
    end,
    type = EventTimelineType.continuous,
    view = EventTimelineView.fill,
    discreteWidth = 2,
    height = 10,
    color,
  } = props;
  const x = scale(start);
  const y = -height / 2;
  const width =
    end && type !== EventTimelineType.discrete ? scale(end) - x : discreteWidth;
  const opacity =
    view === EventTimelineView.fill || type === EventTimelineType.discrete
      ? 1
      : 0.5;

  return (
    <Group>
      {opacity !== 1 ? (
        <rect width={discreteWidth} height={height} fill={color} y={y} x={x} />
      ) : null}
      <rect
        width={width}
        height={height}
        fill={color}
        y={y}
        x={x}
        opacity={opacity}
      />
    </Group>
  );
};

const Group = styled('g')`
  cursor: pointer;
`;
