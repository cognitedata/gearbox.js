// Copyright 2020 Cognite AS
import { ScaleTime, scaleTime } from 'd3-scale';
import { Dictionary } from 'lodash';
import { CogniteEventForTimeline } from './interfaces';

export const getScaleTime: (
  width: number,
  start: number,
  end: number
) => ScaleTime<number, number> = (width, start, end) =>
  scaleTime()
    .domain([start, end])
    .range([0, width]);

export const getEventsByTimestamp = (
  timestamp: number,
  timelines: Dictionary<CogniteEventForTimeline[]>
): CogniteEventForTimeline[] => {
  return Object.keys(timelines).flatMap(color => {
    const tl = timelines[color];

    return tl.reduce((filtered: CogniteEventForTimeline[], event) => {
      const { startTime, endTime } = event;

      if (
        startTime === timestamp ||
        (startTime && endTime && startTime <= timestamp && endTime >= timestamp)
      ) {
        filtered.push({ ...event, color });
      }

      return filtered;
    }, []);
  });
};
