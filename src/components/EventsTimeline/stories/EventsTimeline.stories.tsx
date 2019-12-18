import { storiesOf } from '@storybook/react';
import React from 'react';
import { sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import {
  CogniteEventForTimeline,
  EventTimelineType,
  EventTimelineView,
  TimelineEvent,
} from '../components';
import { EventsTimeline } from '../EventsTimeline';

const now = Date.now();
const start = now - 60 * 60 * 1000;
const end = now;
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

class CogniteClient extends MockCogniteClient {
  events: any = {
    retrieve: async (ids: { id: number }[]) => {
      await sleep(200);

      return ids.map(({ id }, index) => ({
        id,
        createdTime: new Date(),
        lastUpdatedTime: new Date(),
        startTime: now - (59 - index * 2) * 60 * 1000,
        endTime: now - (59 - (index * 2 + 1)) * 60 * 1000,
      }));
    },
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

const ClientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
);

const toTimelines = ({ id }: CogniteEventForTimeline) => {
  return !id ? '#4a85ee' : id === 1 ? '#ee5d7d' : '#cccccc';
};

storiesOf('EventsTimeline', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Full Description',
    () => <EventsTimeline events={events} start={start} end={end} />,
    {}
  )
  .add(
    'To timelines',
    () => (
      <EventsTimeline
        events={events}
        start={start}
        end={end}
        toTimelines={toTimelines}
        ruler={{
          show: false,
          // onEventHover: hovered => console.log(hovered),
          // hoverDebounceTime: 200,
        }}
        zoom={{ enable: true }}
      />
    ),
    {}
  );
