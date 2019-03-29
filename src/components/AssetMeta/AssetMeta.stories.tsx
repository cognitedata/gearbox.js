import { storiesOf } from '@storybook/react';
import React from 'react';
import AssetMeta from './AssetMeta';
import { ASSET_DATA } from 'mocks/assets';
import { EVENTS } from 'mocks/events';

storiesOf('AssetMeta', module)
  .add('Minimal', () => <AssetMeta asset={{ id: 123 }} />)
  .add(
    'Basic send data',
    () => (
      <AssetMeta
        asset={ASSET_DATA}
        docsProps={{
          docs: [
            {
              id: 1,
              fileName: 'file name 1',
              metadata: {
                DOC_TITLE: 'document title 1',
                DOC_TYPE: 'XG',
              },
            },
            {
              id: 2,
              fileName: 'file name 2',
              metadata: {
                DOC_TITLE: 'document title 2',
                DOC_TYPE: 'XB',
              },
            },
          ],
        }}
        eventProps={{ events: EVENTS }}
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
        docs: [
          {
            id: 1,
            fileName: 'file name 1',
            metadata: {
              DOC_TITLE: 'document title 1',
              DOC_TYPE: 'XG',
            },
          },
          {
            id: 2,
            fileName: 'file name 2',
            metadata: {
              DOC_TITLE: 'document title 2',
              DOC_TYPE: 'XB',
            },
          },
        ],
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
          docs: [
            {
              id: 1,
              fileName: 'file name 1',
              metadata: {
                DOC_TITLE: 'document title 1',
                DOC_TYPE: 'XG',
              },
            },
            {
              id: 2,
              fileName: 'file name 2',
              metadata: {
                DOC_TITLE: 'document title 2',
                DOC_TYPE: 'XB',
              },
            },
          ],
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
