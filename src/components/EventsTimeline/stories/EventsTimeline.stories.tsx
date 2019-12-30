import { storiesOf } from '@storybook/react';
import moment from 'moment';
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

import dateFormat from './date-formatter.md';
import { EventsTimelineTooltip } from './EventsTimelineTooltip';
import fullDescription from './full.md';
import ruler from './ruler.md';
import timelines from './to-timelines.md';
import tooltip from './tooltip.md';
import zoom from './zoom.md';

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
        externalId: `Event #${id}`,
        description: `Lorem ipsum dolor`,
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
  return !id ? '#3b7c14' : id === 1 ? '#ee5d7d' : '#cccccc';
};
const onChange = (
  _: React.SyntheticEvent,
  date: number,
  tlEvents?: CogniteEventForTimeline[]
) => console.log('Date - ', new Date(date), 'Events – ', tlEvents);
const onHide = () => console.log('Ruler is hidden');

const onZoomStart = () => console.log('Zoom start');
const onZoom = ([newStart, newEnd]: [number, number]) =>
  console.log(`Zoom to ${new Date(newStart)} - ${new Date(newEnd)}`);
const onZoomEnd = () => console.log('Zoom end');
const dateFormatter = (date: number) =>
  moment(date).format('DD MMM YYYY, hh:mm');

storiesOf('EventsTimeline', module)
  .addDecorator(ClientSDKDecorator)
  .add(
    'Full Description',
    () => <EventsTimeline events={events} start={start} end={end} />,
    {
      readme: {
        content: fullDescription,
      },
    }
  )
  .add(
    'To timelines',
    () => (
      <EventsTimeline
        events={events}
        start={start}
        end={end}
        toTimelines={toTimelines}
      />
    ),
    {
      readme: {
        content: timelines,
      },
    }
  )
  .add(
    'Ruler',
    () => (
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
    ),
    {
      readme: {
        content: ruler,
      },
    }
  )
  .add(
    'Zoom',
    () => (
      <EventsTimeline
        events={events}
        start={start}
        end={end}
        toTimelines={toTimelines}
        zoom={{
          enable: true,
          onZoomStart,
          onZoom,
          onZoomEnd,
        }}
      />
    ),
    {
      readme: {
        content: zoom,
      },
    }
  )
  .add(
    'Date formatting',
    () => (
      <EventsTimeline
        events={events}
        start={start}
        end={end}
        toTimelines={toTimelines}
        zoom={{
          enable: true,
        }}
        dateFormatter={dateFormatter}
      />
    ),
    {
      readme: {
        content: dateFormat,
      },
    }
  )
  .add(
    'Hover tooltip',
    () => (
      <EventsTimelineTooltip
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
    ),
    {
      readme: {
        content: tooltip,
      },
    }
  );
