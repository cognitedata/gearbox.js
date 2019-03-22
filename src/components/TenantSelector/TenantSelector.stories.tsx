// @ts-ignore
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import TenantSelector from 'components/TenantSelector/TenantSelector';

storiesOf('TenantSelector', module)
  .addParameters({
    info: {
      inline: true,
    },
  })
  .add('Success', () => (
    <div>
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
      <TenantSelector
        title="Example app"
        loginText="LET'S ROLL!"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
      <TenantSelector
        title="Example app"
        header={<em>What are you waiting for?</em>}
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
    </div>
  ))
  .add('Error', () => (
    <div>
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.reject(new Error('Unknown'))}
      />
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        unknownMessage="ARE YOU NUTS?!"
        validateTenant={() => Promise.reject(new Error('Unknown'))}
      />
    </div>
  ))
  .add('Loads forever', () => (
    <TenantSelector
      title="Example app"
      onTenantSelected={action('onTenantSelected')}
      validateTenant={() => Promise.race([])}
    />
  ))
  .add('Initial tenant', () => (
    <div>
      <TenantSelector
        title="Example app"
        initialTenant="sample-tenant"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
      <TenantSelector
        title="Example app"
        initialTenant="tenant with ILLEGAL characters!"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
    </div>
  ))
  .add('Placeholder tenant', () => (
    <div>
      <TenantSelector
        title="Example app"
        placeholder="Enter your company's CDP project name"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
      <TenantSelector
        title="Example app"
        initialTenant="sample-tenant"
        placeholder="Enter your company's CDP project name"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
    </div>
  ));
