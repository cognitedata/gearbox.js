import { Event, Events } from '@cognite/sdk';
import { Event as ApiEvent } from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { EVENTS } from '../../../mocks';
import { EventPreview } from '../EventPreview';
import basic from './basic.md';
import fullDescription from './full.md';
import hideButton from './hideButton.md';
import hideDateTime from './hideDateTime.md';
import hideDescription from './hideDescription.md';
import hideLoadingSpinner from './hideLoadingSpinner.md';
import hideMetadata from './hideMetadata.md';
import hideType from './hideType.md';
import missingProperties from './missingProperties.md';
import withCustomText from './withCustomText.md';

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
  }
);

storiesOf('EventPreview/Examples', module)
  .add(
    'Basic',
    () => (
      <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />
    ),
    {
      readme: {
        content: basic,
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
      readme: {
        content: hideType,
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
      readme: {
        content: hideDescription,
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
      readme: {
        content: hideDateTime,
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
      readme: {
        content: hideMetadata,
      },
    }
  )
  .add(
    'Hidden details button',
    () => <EventPreview eventId={25496029326330} />,
    {
      readme: {
        content: hideButton,
      },
    }
  )
  .add(
    'With missing properties',
    () => (
      <EventPreview eventId={35593709738145} onShowDetails={onShowDetails} />
    ),
    {
      readme: {
        content: missingProperties,
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
      readme: {
        content: hideLoadingSpinner,
      },
    }
  )
  .add(
    'With custom text',
    () => (
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
        strings={{
          start: 'From',
          end: 'To',
          details: 'More Details',
          metadataSummary: 'Contains {{count}} more',
        }}
      />
    ),
    {
      readme: {
        content: withCustomText,
      },
    }
  );
