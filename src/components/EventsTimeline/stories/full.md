# Events Timeline

<!-- STORY -->

### Description:

`EventsTimeline` representing events as blocks on timeline between `start` and `end` date.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { EventsTimeline, TimelineEvent } from '@cognite/gearbox';

function ExampleComponent(props) {
  const events: TimelineEvent[] = [
    {
      id: 0,
      type: 'continuous',
      view: 'fill',
    },
  ];
  const end = Date.now();
  const start = end - 60 * 60 * 1000;

  return <EventsTimeline events={events} start={start} end={end} />;
}
```

### Available props:

##### Required:

| Property | Description                                                                                                                              | Type              | Default |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- |
| `events` | Array of timeline events with `type` and `view` properties to configure appearance on the timeline and `id` to fetch event data from CDF | `TimelineEvent[]` |         |
| `start`  | Timeline start time                                                                                                                      | `number`          |         |
| `end`    | Timeline end time                                                                                                                        | `number`          |         |

##### Optionals:

| Property        | Description                                                                 | Type                                         | Default                      |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------- |
| `dateFormatter` | Function that defines formatting of start and end timestamp to be displayed | `(date: number) => string`                   |                              |
| `ruler`         | Describes appearance of ruler for timeline                                  | `TimelineRuler`                              | `{ show: false }`            |
| `timelineSize`  | Defines size for single timeline                                            | `TimelineSize`                               | `{ height: 10, bottom: 10 }` |
| `toTimelines`   | Function that group events to be displayed on different timelines           | `(event: CogniteEventForTimeline) => string` |                              |
| `zoom`          | Describes zooming functionality for component                               | `TimelineZoom`                               | `{ enable: false }`          |

### Types

#### TimelineEvent

`TimelineEvent` type can be imported from `@cognite/gearbox`:

```typescript
enum EventTimelineView {
  fill = 'fill',
  outline = 'outline',
}
enum EventTimelineType {
  discrete = 'discrete',
  continuous = 'continuous',
}
interface TimelineEvent {
  id: number;
  view: EventTimelineView;
  type: EventTimelineType;
}
```

#### TimelineRuler

`TimelineRuler` type can be imported from `@cognite/gearbox`:

```typescript
import { CogniteEvent } from '@cognite/sdk';
import { EventTimelineView, EventTimelineType } from '@cognite/gearbox';

interface CogniteEventForTimeline extends CogniteEvent {
  appearance: {
    view: EventTimelineView;
    type: EventTimelineType;
  };

}

interface TimelineRuler {
  show: boolean;
  onChange?: (event: React.SyntheticEvent, date: number) => void;
  onEventHover?: (event: CogniteEventForTimeline[] | null) => void;
  hoverDebounceTime?: number;
  onHide?: () => void;

}
```

#### TimelineZoom

`TimelineZoom` type can be imported from `@cognite/gearbox`:

```typescript jsx
interface TimelineZoom {
  enable: boolean;
  onZoomStart?: () => void;
  onZoom?: (domain: [number, number]) => void;
  onZoomEnd?: () => void;
}
```
