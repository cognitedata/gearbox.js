import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { SyntheticEvent } from 'react';

import { OnClick } from '../../interfaces';
import { EVENTS, eventWithout } from '../../mocks';
import { EventPreview } from './EventPreview';

const onShowDetails: OnClick = (e: SyntheticEvent) => {
  action('onShowDetails')(e);
};

const stories = storiesOf('EventPreview', module).add(
  'Base',
  () => <EventPreview event={EVENTS[0]} onShowDetails={onShowDetails} />,
  {
    info: {
      maxPropObjectKeys: 10,
    },
  }
);

Object.keys(EVENTS[0]).forEach(field =>
  stories.add(
    `Missing field <${field}>`,
    () => (
      <EventPreview event={eventWithout(field)} onShowDetails={onShowDetails} />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
);
