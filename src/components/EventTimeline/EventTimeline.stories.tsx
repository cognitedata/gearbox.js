import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import moment from 'moment';

import { generateEventTimelineData } from 'mocks/events';

import EventChart from 'components/EventTimeline/EventTimeline';

const data = [
  generateEventTimelineData(
    1,
    +moment().subtract(1, 'd'),
    +moment(),
    'red',
    0.2,
    0.0
  ),
  generateEventTimelineData(
    2,
    +moment().subtract(1, 'd'),
    +moment().add(1, 'd'),
    'blue',
    1.0,
    1.0
  ),
  generateEventTimelineData(
    3,
    +moment(),
    +moment().add(1, 'd'),
    'green',
    0.8,
    1.0
  ),
  generateEventTimelineData(4, +moment(), +moment(), 'orange', 1, 1),
];

storiesOf('EventTimeline', module)
  .add(
    'Base',
    () => <EventChart data={data} onEventClicked={action('onEventClicked')} />,
    {
      info: {
        maxPropArrayLength: 1,
        maxPropObjectKeys: 5,
      },
    }
  )
  .add('Loading', () => <EventChart isLoading={true} data={data} />, {
    info: {
      maxPropArrayLength: 1,
    },
  });
