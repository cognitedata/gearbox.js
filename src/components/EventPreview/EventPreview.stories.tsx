import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React, { SyntheticEvent } from 'react';

import { EventPreview } from './EventPreview';
import { EVENTS, eventWithout } from '../../mocks';
import { OnClick } from '../../interfaces';

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
