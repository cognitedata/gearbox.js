# Ruler

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
  const onChange = (event, date, events) => console.log('Date - ', new Date(date), 'Events - ', events);
  const onHide = () => console.log('Ruler is hidden');

  return (
    <EventsTimeline 
      events={events} 
      start={start} 
      end={end} 
      toTimelines={toTimelines}
      ruler={{
        show: true,
        onChange,
        onHide,
      }}
    />
  );

}
```
