import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { AssetTree } from '../../AssetTree';
import { TenantSelector } from '../../TenantSelector';
import { ThemeProvider } from '../ThemeProvider';

import assetTree from './assetTree.md';
import fullDescription from './full.md';
import tenantSelector from './tenantSelector.md';

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
          textFamily: 'Courier New',
          textSize: 'large',
          listColor: 'red',
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
  );
