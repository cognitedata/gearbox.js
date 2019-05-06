import { Event, Events } from '@cognite/sdk';
import { Event as ApiEvent } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { EVENTS } from '../../../mocks';
import { EventPreview } from '../EventPreview';
import fullDescription from './full.md';

Events.retrieve = (eventId: number): Promise<Event> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const event = EVENTS.find(e => e.id === eventId);
      resolve(event);
    }, 1000); // simulate load delay
  });
};

const onShowDetails = (e: ApiEvent) => {
  action('onShowDetails')(e);
};

storiesOf('EventPreview', module).add(
  'Full Description',
  () => <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />,
  {
    readme: {
      content: fullDescription,
    },
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('EventPreview/Examples', module)
  .add(
    'Basic',
    () => (
      <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden type',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideProperties={['type']}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden subtype',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideProperties={['subtype']}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden description',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideProperties={['description']}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden start/end times',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideProperties={['startTime', 'endTime']}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden metadata',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideProperties={['metadata']}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Hidden details button',
    () => (
      <EventPreview
        eventId={25496029326330}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  )
  .add(
    'Without loading spinner',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        hideLoadingSpinner={true}
      />
    ),
    {
      info: {
        maxPropObjectKeys: 10,
      },
    }
  );
