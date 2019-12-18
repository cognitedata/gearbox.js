import { CogniteEvent } from '@cognite/sdk';
import { event as d3Event } from 'd3';
import { select } from 'd3-selection';
import {
  zoom as d3Zoom,
  ZoomBehavior,
  ZoomedElementBaseType,
  ZoomScale,
} from 'd3-zoom';
import { Dictionary } from 'lodash';
import { debounce } from 'lodash';
import React, { RefObject, useEffect, useState } from 'react';
import { getEventsByTimestamp, getScaleTime } from '../helpers';
import { EventTimelineType, EventTimelineView, Ruler, Timeline } from './index';

interface TimelineEventAppearance {
  view: EventTimelineView;
  type: EventTimelineType;
}

export interface TimelineEvent extends TimelineEventAppearance {
  id: number;
}

export interface TimelineRuler {
  show: boolean;
  onChange?: (event: React.SyntheticEvent, date: number) => void;
  onEventHover?: (event: CogniteEventForTimeline[] | null) => void;
  hoverDebounceTime?: number;
  onHide?: () => void;
}

export interface TimelineSize {
  height: number;
  bottom: number;
}

export interface TimelineZoom {
  enable: boolean;
  onZoomStart?: () => void;
  onZoom?: (domain: [number, number]) => void;
  onZoomEnd?: () => void;
}

export interface CogniteEventForTimeline extends CogniteEvent {
  appearance: TimelineEventAppearance;
}

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

export const ChartLayout: React.FC<ChartLayoutProps> = (
  props: ChartLayoutProps
) => {
  const {
    svg,
    width,
    height,
    timelines,
    timelineSize: { height: tlHeight },
    start,
    end,
    ruler: {
      show: showRuler,
      onChange: onRulerChange,
      onHide: onRulerHide,
      onEventHover,
      hoverDebounceTime,
    } = {
      show: false,
      onChange: undefined,
      onHide: undefined,
      onEventHover: undefined,
      hoverDebounceTime: undefined,
    },
    zoom: { enable: zoomEnable, onZoomStart, onZoom, onZoomEnd } = {
      enable: false,
      onZoomStart: undefined,
      onZoom: undefined,
      onZoomEnd: undefined,
    },
  } = props;

  const [rulerVisibility, setRulerVisibility] = useState<boolean>(showRuler);

  const scale = getScaleTime(width, start, end);

  const handleZoom = () => {
    if (!zoomEnable || !svg || !svg.current) {
      return null;
    }

    const zoom = d3Zoom()
      .scaleExtent([1, 100])
      .on('start', zoomStart)
      .on('zoom', zoomed)
      .on('end', zoomEnd);

    select(svg.current).call(zoom);

    return zoom;
  };

  const removeZoomListener = <T extends ZoomedElementBaseType, K>(
    zoom: ZoomBehavior<T, K> | null
  ) => {
    if (!zoom) {
      return;
    }

    zoom
      .on('start', null)
      .on('end', null)
      .on('zoom', null);
  };

  const zoomStart = () => {
    setRulerVisibility(false);

    if (onZoomStart) {
      onZoomStart();
    }
  };

  const zoomed = () => {
    if (!d3Event || d3Event.type !== 'zoom') {
      return;
    }

    const t = d3Event.transform;
    const newDomain = (t.rescaleX(scale as ZoomScale).domain() as [
      Date,
      Date,
    ]).map((date: Date) => date.getTime()) as [number, number];

    if (onZoom) {
      onZoom(newDomain);
    }
  };

  const zoomEnd = () => {
    setRulerVisibility(showRuler);

    if (onZoomEnd) {
      onZoomEnd();
    }
  };

  const onRulerMove = (event: React.SyntheticEvent | null) => {
    if (!event) {
      if (onRulerHide) {
        onRulerHide();
      }
      if (onEventHover) {
        debounceOnEventHover(null);
      }

      return;
    }

    const { offsetX } = event.nativeEvent as MouseEvent;
    const time = scale.invert(offsetX).getTime();

    if (onRulerChange) {
      onRulerChange(event, time);
    }

    if (onEventHover) {
      debounceOnEventHover(time);
    }
  };

  const debounceOnEventHover = debounce((time: number | null) => {
    if (!onEventHover) {
      return;
    }

    if (time === null) {
      return onEventHover([]);
    }

    const filteredEvents = getEventsByTimestamp(time, timelines);

    onEventHover(filteredEvents);
  }, hoverDebounceTime);

  useEffect(() => {
    const zoom = handleZoom();

    return () => {
      removeZoomListener(zoom);
    };
  }, [svg]);

  const renderTimelines = () =>
    Object.keys(timelines).map((color, index) => (
      <Timeline
        key={color}
        events={timelines[color]}
        width={width}
        color={color}
        height={tlHeight}
        index={index}
        scale={scale}
      />
    ));

  return (
    <>
      {renderTimelines()}
      {rulerVisibility && (
        <Ruler width={width} height={height} onMouseMove={onRulerMove} />
      )}
    </>
  );
};
