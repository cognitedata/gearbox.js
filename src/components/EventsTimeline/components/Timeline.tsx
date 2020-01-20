import React from 'react';
import { Event } from './Event';
import { TimelineProps } from './interfaces';

export const Timeline: React.FC<TimelineProps> = (props: TimelineProps) => {
  const { events, width, color, height, index, padding = 10, scale } = props;
  const renderEvents = () =>
    events.map(
      ({ startTime: s, endTime: e, id, appearance: { view, type } }) => (
        <Event
          key={id}
          color={color}
          start={s!}
          end={e!}
          scale={scale}
          view={view}
          type={type}
          height={height}
        />
      )
    );

  return (
    <g transform={`translate(0, ${index * (height + padding) + height})`}>
      <path d={`M0,0H${width}`} stroke={color} strokeWidth={2} />
      {renderEvents()}
    </g>
  );
};
