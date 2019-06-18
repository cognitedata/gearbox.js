import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { fakeEvents } from '../../../mocks';
import { AssetTree } from '../../AssetTree';
import { fakeClient } from '../../AssetTree/stories/AssetTree.stories';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { EventPreview } from '../../EventPreview';
import { TenantSelector } from '../../TenantSelector';
import { ThemeProvider } from '../ThemeProvider';

import assetTree from './assetTree.md';
import eventPreview from './eventPreview.md';
import fullDescription from './full.md';
import tenantSelector from './tenantSelector.md';

const clientSDKDecorator = (storyFn: any) => (
  <ClientSDKProvider client={fakeClient}>{storyFn()}</ClientSDKProvider>
);

storiesOf('ThemeProvider', module).add(
  'Full Description',
  () => (
    <ThemeProvider
      theme={{
        primaryColor: 'orange',
        textColor: '#999',
        containerColor: '#F4F4F4',
        lightGrey: 'white',
        buttonDisabledColor: '#DDD',
        lightShadow: 'rgba(0, 0, 0, 0.15) 10px 10px 8px 8px',
      }}
    >
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
      />
    </ThemeProvider>
  ),
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('ThemeProvider/Examples', module)
  .addDecorator(clientSDKDecorator)
  .add(
    'Tenant Selector',
    () => (
      <ThemeProvider
        theme={{
          primaryColor: 'purple',
          textColor: '#DDD',
          containerColor: '#666666',
          lightGrey: 'black',
          textColorDisabled: '#888',
          lightShadow: 'none',
          buttonBorderColor: '#666666',
          buttonDisabledColor: '#777777',
        }}
      >
        <TenantSelector
          title="Example app"
          onTenantSelected={action('onTenantSelected')}
        />
      </ThemeProvider>
    ),
    {
      readme: {
        content: tenantSelector,
      },
    }
  )
  .add(
    'Asset Tree',
    () => (
      <ThemeProvider
        theme={{
          fontFamily: 'Courier New',
          fontSize: 'large',
          textColor: '#a88400',
          listHighlight: '#00b893',
        }}
      >
        <AssetTree />
      </ThemeProvider>
    ),
    {
      readme: {
        content: assetTree,
      },
    }
  )
  .add(
    'Event Preview',
    () => {
      // @ts-ignore
      fakeClient.events = {
        retrieve: () => Promise.resolve([fakeEvents[0]]),
      };
      return (
        <ThemeProvider
          theme={{
            fontFamily: 'Trebuchet MS',
            textColorSecondary: '#555577',
            textColorAccent: 'red',
            containerColor: '#DDD',
            containerBorderColor: '#777',
          }}
        >
          <EventPreview eventId={123} />
        </ThemeProvider>
      );
    },
    {
      readme: {
        content: eventPreview,
      },
    }
  );
