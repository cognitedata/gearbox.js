# Custom Tooltip

<!-- STORY -->

### Code example:

```typescript jsx
import React, { SyntheticEvent, useState } from 'react';
import { 
  EventsTimeline, 
  EventsTimelineProps, 
  CogniteEventForTimeline 
} from '@cognite/gearbox';

export const EventsTimelineTooltip = (props: EventsTimelineProps) => {
  const [events, setEvents] = useState<CogniteEventForTimeline[]>([]);
  const [t, setPosition] = useState([0, 0]);

  const onChange = (
    e: SyntheticEvent,
    date: number,
    tlEvents?: CogniteEventForTimeline[]
  ) => {
    const { offsetX, offsetY } = e.nativeEvent as MouseEvent;

    setEvents(tlEvents ? tlEvents : []);
    setPosition([offsetX, offsetY]);
  };

  const onHide = () => {
    setEvents([]);
  };

  return (
    <div>
      <EventsTimeline
        {...props}
        ruler={{
          show: true,
          onHide,
          onChange,
        }}
      />
      {!!events.length && (
        <div style={{ transform: `translate(${t[0]}px, ${t[1]}px)` }}>
          {renderEvents(events)}
        </div>
      )}
    </div>
  );

};

const renderEvents = (events: CogniteEventForTimeline[]) =>
  events.map(e => (
    <div>
      <p style={{ color: e.color || '#000' }}>{e.externalId || e.type}</p>
      <p>{e.description}</p>
    </div>
  
));
```
