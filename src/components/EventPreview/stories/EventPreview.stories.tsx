import { Event, Events } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { SyntheticEvent } from 'react';
import { OnClick } from '../../../interfaces';
import { EVENTS } from '../../../mocks';
import { EventPreview } from '../EventPreview';

Events.retrieve = (eventId: number): Promise<Event> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const event = EVENTS.find(e => e.id === eventId);
      resolve(event);
    }, 1000); // simulate load delay
  });
};

const onShowDetails: OnClick = (e: SyntheticEvent) => {
  action('onShowDetails')(e);
};

const stories = storiesOf('EventPreview', module).add(
  'Basic',
  () => <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />,
  {
    info: {
      maxPropObjectKeys: 10,
    },
  }
);

// Object.keys(EVENTS[0]).forEach(field =>
//   stories.add(
//     `Missing field <${field}>`,
//     () => (
//       <EventPreview event={eventWithout(field)} onShowDetails={onShowDetails} />
//     ),
//     {
//       info: {
//         maxPropObjectKeys: 10,
//       },
//     }
//   )
// );
