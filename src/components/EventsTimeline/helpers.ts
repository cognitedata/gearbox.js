import { ScaleTime, scaleTime } from 'd3-scale';
import { Dictionary } from 'lodash';
import { CogniteEventForTimeline } from './EventsTimeline';

export const getScaleTime: (
  start: number,
  end: number,
  width: number
) => ScaleTime<number, number> = (start, end, width) =>
  scaleTime()
    .domain([start, end])
    .range([0, width]);

export const getEventsByTimestamp = (
  date: number,
  timelines: Dictionary<CogniteEventForTimeline[]>
): CogniteEventForTimeline[] => {
  return Object.keys(timelines).flatMap(color => {
    const tl = timelines[color];

    return tl.filter(
      ({ startTime, endTime }) =>
        startTime === date ||
        (startTime && endTime && startTime <= date && endTime >= date)
    );
  });
};
