# Zoom

<!-- STORY -->

### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { 
  EventsTimeline, 
  TimelineEvent, 
  CogniteEventForTimeline, 
} from '@cognite/gearbox';

function ExampleComponent(props) {
  const events: TimelineEvent[] = [
    // ...
  ];
  const end = Date.now();
  const start = end - 60 * 60 * 1000;
  const toTimelines = ({ id }: CogniteEventForTimeline) => {
    return !id ? '#3b7c14' : id === 1 ? '#ee5d7d' : '#cccccc';
  };
  const onZoomStart = () => console.log('Zoom start');
  const onZoom = ([newStart, newEnd]: [number, number]) =>
    console.log(`Zoom to ${new Date(newStart)} - ${new Date(newEnd)}`);
  const onZoomEnd = () => console.log('Zoom end');

  return (
    <EventsTimeline 
      events={events} 
      start={start} 
      end={end} 
      toTimelines={toTimelines}
      ruler={{
        enable: true,
        onZoomStart,
        onZoom,
        onZoomEnd,
      }}
    />
  );

}
```
