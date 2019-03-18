// @ts-ignore
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import TenantSelector from './TenantSelector';

storiesOf('TenantSelector', module)
  .add('Success', () => (
    <React.Fragment>
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
    </React.Fragment>
  ))
  .add('Error', () => (
    <React.Fragment>
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
    </React.Fragment>
  ))
  .add('Loads forever', () => (
    <TenantSelector
      title="Example app"
      onTenantSelected={action('onTenantSelected')}
      validateTenant={() => Promise.race([])}
    />
  ))
  .add('Initial tenant', () => (
    <React.Fragment>
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
    </React.Fragment>
  ))
  .add('Placeholder tenant', () => (
    <React.Fragment>
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
    </React.Fragment>
  ));
