// Copyright 2020 Cognite AS
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

export interface TimelineRulerChangeProps {
  event: SyntheticEvent;
  timestamp: number;
  timelineEvents?: CogniteEventForTimeline[];
}

export interface TimelineRuler {
  show: boolean;
  onChange?: (change: TimelineRulerChangeProps) => void;
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
  /**
   * Array of events objects represented by event `id`, `view` and `type`.
   * `view` and `type` describes event appearance on the timeline.
   */
  events: TimelineEvent[];
  /**
   * Timeline start timestamp
   */
  start: number;
  /**
   * Timeline end timestamp
   */
  end: number;
  /**
   * Object that defines ruler appearance while user hovering component.
   */
  ruler?: TimelineRuler;
  /**
   * Object that defines zoom capabilities of the component
   */
  zoom?: TimelineZoom;
  /**
   * Function that passed to `_.groupBy()` function of `lodash` library
   * as an argument and grouping events by timelines, which are represented
   * by color strings (`#000` as a default). Check related story for more info
   */
  toTimelines?: (event: CogniteEventForTimeline) => string;
  /**
   * Object that defines paddings of each timeline in the component
   */
  timelineSize?: TimelineSize;
  /**
   * Function that receives timestamp to format it and render as a readable
   * time string
   */
  dateFormatter?: (timestamp: number) => string;
}
