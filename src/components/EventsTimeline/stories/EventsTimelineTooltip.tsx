import React, { useState } from 'react';
import styled from 'styled-components';
import { EventsTimeline } from '../EventsTimeline';
import {
  CogniteEventForTimeline,
  EventsTimelineProps,
  TimelineRulerChangeProps,
} from '../interfaces';

export const EventsTimelineTooltip = (props: EventsTimelineProps) => {
  const [events, setEvents] = useState<CogniteEventForTimeline[]>([]);
  const [t, setPosition] = useState([0, 0]);

  const { show, onChange, onHide } = props.ruler || { show: false };

  const rulerChange = ({
    event,
    timestamp,
    timelineEvents,
  }: TimelineRulerChangeProps) => {
    if (onChange) {
      onChange({ event, timestamp, timelineEvents });
    }

    const { offsetX, offsetY } = event.nativeEvent as MouseEvent;

    setEvents(timelineEvents ? timelineEvents : []);
    setPosition([offsetX, offsetY]);
  };

  const rulerHide = () => {
    if (onHide) {
      onHide();
    }
    setEvents([]);
  };

  return (
    <Wrapper>
      <EventsTimeline
        {...props}
        ruler={{
          show,
          onHide: rulerHide,
          onChange: rulerChange,
        }}
      />
      {!!events.length && (
        <Tooltip style={{ transform: `translate(${t[0]}px, ${t[1]}px)` }}>
          {renderEvents(events)}
        </Tooltip>
      )}
    </Wrapper>
  );
};

const renderEvents = (events: CogniteEventForTimeline[]) =>
  events.map(e => (
    <Event key={e.externalId}>
      <Line style={{ color: e.color || '#000' }}>{e.externalId || e.type}</Line>
      <Line>{e.description}</Line>
    </Event>
  ));

const Wrapper = styled.div`
  position: relative;
`;
const Tooltip = styled.div`
  position: absolute;
  top: 0;
  left: 15px;
  pointer-events: none;
  padding: 5px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
`;
const Event = styled.div`
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Line = styled.p`
  margin: 0;
`;
