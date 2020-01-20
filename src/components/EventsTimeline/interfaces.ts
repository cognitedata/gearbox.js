import { CogniteEvent } from '@cognite/sdk';
import { SyntheticEvent } from 'react';

export enum EventTimelineType {
  discrete = 'discrete',
  continuous = 'continuous',
}

export enum EventTimelineView {
  fill = 'fill',
  outline = 'outline',
}

export interface TimelineEventAppearance {
  view: EventTimelineView;
  type: EventTimelineType;
}

export interface TimelineEvent extends TimelineEventAppearance {
  id: number;
}

export interface CogniteEventForTimeline extends CogniteEvent {
  appearance: TimelineEventAppearance;
  color?: string;
}

export interface TimelineRuler {
  show: boolean;
  onChange?: (
    e: SyntheticEvent,
    date: number,
    events?: CogniteEventForTimeline[]
  ) => void;
  onHide?: () => void;
}

export interface TimelineZoom {
  enable: boolean;
  onZoomStart?: () => void;
  onZoom?: (domain: [number, number]) => void;
  onZoomEnd?: () => void;
}

export interface TimelineSize {
  height: number;
  bottom: number;
}

export interface EventsTimelineProps {
  events: TimelineEvent[];
  start: number;
  end: number;
  ruler?: TimelineRuler;
  zoom?: TimelineZoom;
  toTimelines?: (event: CogniteEventForTimeline) => string;
  timelineSize?: TimelineSize;
  dateFormatter?: (date: number) => string;
}
