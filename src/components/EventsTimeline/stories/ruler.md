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
  const onChange = (event, date) => console.log('Date - ', new Date(date));
  const onEventHover = event => console.log('Event - ', event);
  const onHide = () => console.log('Ruler is hidden');
  const hoverDebounceTime = 200;

  return (
    <EventsTimeline 
      events={events} 
      start={start} 
      end={end} 
      toTimelines={toTimelines}
      ruler={{
        show: true,
        onChange: onChange,
        onEventHover: onEventHover,
        hoverDebounceTime: hoverDebounceTime,
        onHide: onHide,
      }}
    />
  );

}
```
