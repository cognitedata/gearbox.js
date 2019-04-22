import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { eventTimelineDataSrc, generateEventTimelineData } from '../../mocks';

import { EventTimeline } from './EventTimeline';

const data = eventTimelineDataSrc.map(event =>
  // @ts-ignore – reason – support of spread operator in tslint
  generateEventTimelineData(...event)
);

storiesOf('EventTimeline', module)
  .add(
    'Base',
    () => (
      <EventTimeline data={data} onEventClicked={action('onEventClicked')} />
    ),
    {
      info: {
        maxPropArrayLength: 1,
        maxPropObjectKeys: 5,
      },
    }
  )
  .add('Loading', () => <EventTimeline isLoading={true} data={data} />, {
    info: {
      maxPropArrayLength: 1,
    },
  });
