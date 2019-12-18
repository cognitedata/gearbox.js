# Date formatter

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
import moment from 'moment';

function ExampleComponent(props) {
  const events: TimelineEvent[] = [
    // ...
  ];
  const end = Date.now();
  const start = end - 60 * 60 * 1000;
  const toTimelines = ({ id }: CogniteEventForTimeline) => {
    return !id ? '#3b7c14' : id === 1 ? '#ee5d7d' : '#cccccc';
  };
  const dateFormatter = (date: number) =>
    moment(date).format('DD MMM YYYY, hh:mm');

  return (
    <EventsTimeline 
      events={events} 
      start={start} 
      end={end} 
      toTimelines={toTimelines}
      zoom={{enable: true}}
      dateFormatter={dateFormatter}
    />
  );

}
```
