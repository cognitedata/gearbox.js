import { ScaleTime } from 'd3-scale';
import { Dictionary } from 'lodash';
import { RefObject, SyntheticEvent } from 'react';
import {
  CogniteEventForTimeline,
  EventTimelineType,
  EventTimelineView,
  TimelineRuler,
  TimelineSize,
  TimelineZoom,
} from '../interfaces';

export interface ChartLayoutProps {
  svg: RefObject<Element> | null;
  width: number;
  height: number;
  timelines: Dictionary<CogniteEventForTimeline[]>;
  timelineSize: TimelineSize;
  start: number;
  end: number;
  ruler?: TimelineRuler;
  zoom?: TimelineZoom;
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

export interface EventTimelineRulerProps {
  width: number;
  height: number;
  positionChanged?: (e: SyntheticEvent | null) => void;
}

export interface TimelineProps {
  width: number;
  height: number;
  events: CogniteEventForTimeline[];
  color: string;
  index: number;
  scale: ScaleTime<number, number>;
  padding?: number;
}
