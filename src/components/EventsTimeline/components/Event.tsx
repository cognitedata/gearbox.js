// Copyright 2020 Cognite AS
import React from 'react';
import styled from 'styled-components';
import { EventTimelineType, EventTimelineView } from '../interfaces';
import { EventProps } from './interfaces';

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
