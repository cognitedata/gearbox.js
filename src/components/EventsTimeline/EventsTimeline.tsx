import { CogniteEvent } from '@cognite/sdk';
import { event as d3Event } from 'd3';
import { select } from 'd3-selection';
import { zoom, ZoomScale } from 'd3-zoom';
import { Dictionary, groupBy } from 'lodash';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useCogniteContext } from '../../context/clientSDKProxyContext';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import {
  EventTimelineType,
  EventTimelineView,
  Ruler,
  Timeline,
} from './components';
import { getEventsByTimestamp, getScaleTime } from './helpers';

export interface TimelineEvent {
  id: number;
  view: EventTimelineView;
  type: EventTimelineType;
}

export interface TimelineSize {
  height: number;
  bottom: number;
}

export interface TimelineRuler {
  show: boolean;
  onChange?: (event: React.SyntheticEvent, date: number) => void;
  onEventHover?: (event: CogniteEventForTimeline[] | null) => void;
  onEventHoverDebounce?: number;
  onHide?: () => void;
}

export interface CogniteEventForTimeline extends CogniteEvent {
  timeline: TimelineEvent;
}

export interface EventsTimelineProps {
  events: TimelineEvent[];
  start: number;
  end: number;
  ruler?: TimelineRuler;
  toTimelines?: (event: CogniteEventForTimeline) => string;
  timelineSize?: TimelineSize;
  dateFormatter?: string;
}

const toTimelinesDefault = (_: CogniteEventForTimeline) => '#000';

export const EventsTimeline: React.FC<EventsTimelineProps> = (
  props: EventsTimelineProps
) => {
  const {
    events,
    start,
    end,
    toTimelines,
    ruler: {
      show: showRuler,
      onChange: onRulerChange,
      onHide: onRulerHide,
      onEventHover,
      onEventHoverDebounce,
    } = {
      show: false,
      onChange: undefined,
      onHide: undefined,
      onEventHover: undefined,
      onEventHoverDebounce: 500,
    },
    dateFormatter = 'hh:mm, DD MMM YYYY',
    timelineSize: { height: tlHeight, bottom: tlBottom } = {
      height: 10,
      bottom: 10,
    },
  } = props;
  const context = useCogniteContext(EventsTimeline);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [timelines, setTimelines] = useState<
    Dictionary<CogniteEventForTimeline[]>
  >({});
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [domain, setDomain] = useState<[number, number]>([start, end]);
  const [rulerVisability, setRulerVisability] = useState<boolean>(showRuler);
  const zoomScale = getScaleTime(start, end, width);
  // @ts-ignore
  const scale = getScaleTime(...domain, width);

  const retrieveEvents = async () => {
    const ids = events.map(({ id }) => ({ id }));
    const sdkEvents = await context!.events.retrieve(ids);

    return sdkEvents.map((e, i) => ({ ...e, timeline: events[i] }));
  };
  const onEventsPropChanges = async () => {
    const timelineEvents = await retrieveEvents();
    const groupTimelines: Dictionary<CogniteEventForTimeline[]> = groupBy<
      CogniteEventForTimeline
    >(timelineEvents, toTimelines || toTimelinesDefault);
    const componentHeight =
      Object.keys(groupTimelines).length * (tlHeight + tlBottom);

    setTimelines(groupTimelines);
    setHeight(componentHeight);
  };

  const handleResize = () => {
    if (!wrapperRef.current) {
      return;
    }

    const { width: currentWidth } = wrapperRef.current!.getBoundingClientRect();

    setWidth(currentWidth);
  };

  const zoomStart = () => {
    setRulerVisability(false);
  };

  const zoomed = () => {
    if (!d3Event || d3Event.type !== 'zoom') {
      return;
    }

    const t = d3Event.transform;
    const newDomain = t.rescaleX(zoomScale as ZoomScale).domain();

    setDomain(newDomain);
  };

  const zoomEnd = () => {
    setRulerVisability(showRuler);
  };

  const d3zoom = zoom()
    .scaleExtent([1, 100])
    .on('start', zoomStart)
    .on('zoom', zoomed)
    .on('end', zoomEnd);

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

    const filteredEvents = getEventsByTimestamp(time!, timelines);

    onEventHover(filteredEvents);
  }, onEventHoverDebounce);

  useEffect(() => {
    onEventsPropChanges();
  }, [events]);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <Wrapper ref={wrapperRef}>
      {width && Object.keys(timelines).length ? (
        <>
          <Dates>
            <span>{moment(domain[0]).format(dateFormatter)}</span>
            <span>{moment(domain[1]).format(dateFormatter)}</span>
          </Dates>
          <svg
            width={width}
            height={height}
            ref={ref => select(ref as Element).call(d3zoom)}
          >
            {renderTimelines()}
            {rulerVisability && (
              <Ruler width={width} height={height} onMouseMove={onRulerMove} />
            )}
          </svg>
        </>
      ) : (
        <LoadingBlock height={'50px'} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 1px;
`;
const Dates = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
