import { CogniteClient } from '@cognite/sdk';
import { CogniteEvent, IdEither } from '@cognite/sdk/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
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
import hideType from './hideType.md';
import missingProperties from './missingProperties.md';
import withCustomText from './withCustomText.md';
import withTheme from './withTheme.md';

const fakeClient: CogniteClient = {
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

const clientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={fakeClient}>{storyFn()}</ClientSDKProvider>
);

storiesOf('EventPreview', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Full Description',
    () => (
      <EventPreview eventId={25496029326330} onShowDetails={onShowDetails} />
    ),
    {
      readme: {
        content: fullDescription,
      },
    }
  );

storiesOf('EventPreview/Examples', module)
  .addDecorator(clientSDKDecorator)
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
        <EventPreview
          eventId={25496029326330}
          onShowDetails={onShowDetails}
          styles={styles}
        />
      );
    },
    {
      readme: {
        content: customStyles,
      },
    }
  )
  .add(
    'With Theme',
    () => {
      const exampleTheme = {
        gearbox: {
          containerColor: 'AliceBlue',
          containerBorderColor: 'Aqua',
          textColorAccent: 'Coral',
          textColorSecondary: 'ForestGreen',
        },
      };
      return (
        <ThemeProvider theme={exampleTheme}>
          <EventPreview
            eventId={25496029326330}
            onShowDetails={onShowDetails}
          />
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: withTheme,
      },
    }
  );
