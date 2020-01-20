import moment from 'moment';
import React from 'react';
import { MockCogniteClient, sleep } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { CogniteEventForTimeline, TimelineEvent } from '../interfaces';
import { EventTimelineType, EventTimelineView } from '../interfaces';

const now = Date.now();
export const start = now - 60 * 60 * 1000;
export const end = now;
export const events: TimelineEvent[] = [
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

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={sdk}>{storyFn()}</ClientSDKProvider>
  ),
];

export const toTimelines = ({ id }: CogniteEventForTimeline) => {
  return !id ? '#3b7c14' : id === 1 ? '#ee5d7d' : '#cccccc';
};

export const onChange = (
  _: React.SyntheticEvent,
  date: number,
  tlEvents?: CogniteEventForTimeline[]
) => console.log('Date - ', new Date(date), 'Events – ', tlEvents);

export const onHide = () => console.log('Ruler is hidden');

export const onZoomStart = () => console.log('Zoom start');

export const onZoom = ([newStart, newEnd]: [number, number]) =>
  console.log(`Zoom to ${new Date(newStart)} - ${new Date(newEnd)}`);

export const onZoomEnd = () => console.log('Zoom end');

export const dateFormatter = (date: number) =>
  moment(date).format('DD MMM YYYY, hh:mm');

export const dateFormatterCode = dateFormatter.toString();
