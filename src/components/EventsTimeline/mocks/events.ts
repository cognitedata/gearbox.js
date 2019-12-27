import { fakeEvents } from '../../../mocks';
import {
  CogniteEventForTimeline,
  EventTimelineType,
  EventTimelineView,
  TimelineEvent,
} from '../components';

export const timelineEvents: TimelineEvent[] = [
  {
    id: 8825861064387,
    type: EventTimelineType.continuous,
    view: EventTimelineView.fill,
  },
  {
    id: 1995162693488,
    type: EventTimelineType.discrete,
    view: EventTimelineView.outline,
  },
];

export const getCogniteEventsForTimeline: (
  tlEvents: TimelineEvent[]
) => CogniteEventForTimeline[] = (tlEvents: TimelineEvent[]) =>
  tlEvents.map(({ id, type, view }) => ({
    ...fakeEvents.find(e => e.id === id)!,
    appearance: { view, type },
  }));
