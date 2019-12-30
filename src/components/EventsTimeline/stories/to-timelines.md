# To timelines

<!-- STORY -->

### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { 
  EventsTimeline, 
  TimelineEvent, 
  CogniteEventForTimeline, 
  EventTimelineView,
  EventTimelineType
} from '@cognite/gearbox';

function ExampleComponent(props) {
  const events: TimelineEvent[] = [
    {
      id: 0,
      view: EventTimelineView.fill,
      type: EventTimelineType.continuous,
    },
    {
     id: 1,
      view: EventTimelineView.outline,
      type: EventTimelineType.continuous,
    },
    {
     id: 2,
      view: EventTimelineView.outline,
      type: EventTimelineType.discrete,
    },
  ];
  const end = Date.now();
  const start = end - 60 * 60 * 1000;
  const toTimelines = ({ id }: CogniteEventForTimeline) => {
    return !id ? '#3b7c14' : id === 1 ? '#ee5d7d' : '#cccccc';
  };

  return (
    <EventsTimeline 
      events={events} 
      start={start} 
      end={end} 
      toTimelines={toTimelines}
    />
  );

}
```
