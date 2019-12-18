import { ScaleTime } from 'd3-scale';
import React from 'react';
import { CogniteEventForTimeline } from './ChartLayout';
import { Event } from './Event';

export interface TimelineProps {
  width: number;
  height: number;
  events: CogniteEventForTimeline[];
  color: string;
  index: number;
  scale: ScaleTime<number, number>;
  padding?: number;
}

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
