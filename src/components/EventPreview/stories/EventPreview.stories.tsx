import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import {
  CogniteEvent,
  IdEither,
} from '@cognite/sdk-alpha/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { fakeEvents } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { EventPreview, EventPreviewStyles } from '../EventPreview';
import basic from './basic.md';
import customStyles from './customStyles.md';
import fullDescription from './full.md';
import hideButton from './hideButton.md';
import hideDateTime from './hideDateTime.md';
import hideDescription from './hideDescription.md';
import hideLoadingSpinner from './hideLoadingSpinner.md';
import hideMetadata from './hideMetadata.md';
import missingProperties from './missingProperties.md';
import withCustomText from './withCustomText.md';

const fakeClient: API = {
  // @ts-ignore
  events: {
    retrieve: (ids: IdEither[]): Promise<CogniteEvent[]> => {
      return new Promise(resolve => {
        setTimeout(() => {
          // @ts-ignore
          const event = fakeEvents.find(e => e.id === ids[0].id);
          // @ts-ignore
          resolve([event]);
        }, 1000); // simulate load delay
      });
    },
  },
};

const onShowDetails = (e: CogniteEvent) => {
  action('onShowDetails')(e);
};

storiesOf('EventPreview', module).add(
  'Full Description',
  () => (
    <ClientSDKProvider client={fakeClient}>
      <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />
    </ClientSDKProvider>
  ),
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
      <ClientSDKProvider client={fakeClient}>
        <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Hidden description',
    () => (
      <ClientSDKProvider client={fakeClient}>
        <EventPreview
          eventId={25496029326330}
          onShowDetails={onShowDetails}
          hideProperties={['description']}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
        <EventPreview
          eventId={25496029326330}
          onShowDetails={onShowDetails}
          hideProperties={['startTime', 'endTime']}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
        <EventPreview
          eventId={25496029326330}
          onShowDetails={onShowDetails}
          hideProperties={['metadata']}
        />
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: hideMetadata,
      },
    }
  )
  .add(
    'Hidden details button',
    () => (
      <ClientSDKProvider client={fakeClient}>
        <EventPreview eventId={25496029326330} />
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: hideButton,
      },
    }
  )
  .add(
    'With missing properties',
    () => (
      <ClientSDKProvider client={fakeClient}>
        <EventPreview eventId={35593709738145} onShowDetails={onShowDetails} />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
        <EventPreview
          eventId={25496029326330}
          onShowDetails={onShowDetails}
          hideLoadingSpinner={true}
        />
      </ClientSDKProvider>
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
      <ClientSDKProvider client={fakeClient}>
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
      </ClientSDKProvider>
    ),
    {
      readme: {
        content: withCustomText,
      },
    }
  )
  .add(
    'With custom styles',
    () => {
      const styles: EventPreviewStyles = {
        wrapper: { backgroundColor: 'pink' },
        eventType: { color: 'green' },
        description: { color: 'yellow' },
        button: { color: 'black', backgroundColor: 'magenta' },
        times: { backgroundColor: 'purple' },
        metadata: { backgroundColor: 'lightblue' },
      };
      return (
        <ClientSDKProvider client={fakeClient}>
          <EventPreview
            eventId={25496029326330}
            onShowDetails={onShowDetails}
            styles={styles}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  );
