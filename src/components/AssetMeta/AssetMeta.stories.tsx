import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import AssetMeta from './AssetMeta';
import { ASSET_DATA } from 'mocks/assets';
import { EVENTS } from 'mocks/events';
import { DOCUMENTS } from 'mocks/documents';

const onPaneChange = (key: string) => action('onPaneChange')(key);

storiesOf('AssetMeta', module)
  .add('Minimal', () => <AssetMeta asset={{ id: 123, name: '' }} />)
  .add(
    'Basic send data',
    () => (
      <AssetMeta
        asset={ASSET_DATA}
        docsProps={{
          docs: DOCUMENTS,
        }}
        eventProps={{ events: EVENTS }}
        onPaneChange={onPaneChange}
      />
    ),
    {
      info: {
        text:
          'You can add info to docsProps, eventProps and detailProps ' +
          'to alter the subcomponent. See storybooks with more examples: AssetDetailsPanel, ' +
          'AssetEventsPanel and DocumentTable',
      },
    }
  )
  .add('Alternate default tab', () => (
    <AssetMeta
      asset={ASSET_DATA}
      tab="events"
      docsProps={{
        docs: DOCUMENTS,
      }}
      eventProps={{ events: EVENTS }}
    />
  ))
  .add(
    'Hide a tab',
    () => (
      <AssetMeta
        asset={ASSET_DATA}
        tab="events"
        docsProps={{
          docs: DOCUMENTS,
        }}
        eventProps={{ events: EVENTS }}
        hidePanels={['details']}
      />
    ),
    {
      info: {
        text: 'You can define panels if you do not wat to display them.',
      },
    }
  );
