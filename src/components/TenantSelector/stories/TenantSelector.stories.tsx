// @ts-ignore
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { TenantSelector } from '../TenantSelector';

import advancedOptions from './advancedOptions.md';
import basic from './basic.md';
import customErrorMessageOnValidationError from './customErrorMessageOnValidationError.md';
import customStyles from './customStyles.md';
import customValidationError from './customValidationError.md';
import customValidationSuccess from './customValidationSuccess.md';
import fullDescription from './full.md';
import headerText from './headerText.md';
import initialTenant from './initialTenant.md';
import loadsForever from './loadsForever.md';
import loginText from './loginText.md';
import placeholderTenant from './placeholderTenant.md';

storiesOf('TenantSelector', module).add(
  'Full Description',
  () => (
    <TenantSelector
      title="Example app"
      onTenantSelected={action('onTenantSelected')}
    />
  ),
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('TenantSelector/Examples', module)
  .add(
    'Basic',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
      />
    ),
    {
      readme: {
        content: basic,
      },
    }
  )
  .add(
    'Login text',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        header="Your company"
        loginText="LET'S ROLL!"
      />
    ),
    {
      readme: {
        content: loginText,
      },
    }
  )
  .add(
    'Header text',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        header={<em>What are you waiting for?</em>}
      />
    ),
    {
      readme: {
        content: headerText,
      },
    }
  )
  .add(
    'Custom validation success',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.resolve(true)}
      />
    ),
    {
      readme: {
        content: customValidationSuccess,
      },
    }
  )
  .add(
    'Custom validation error',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.reject(new Error('Unknown'))}
      />
    ),
    {
      readme: {
        content: customValidationError,
      },
    }
  )
  .add(
    'Custom error message on validation error',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        unknownMessage="ARE YOU NUTS?!"
        validateTenant={() => Promise.reject(new Error('Unknown'))}
      />
    ),
    {
      readme: {
        content: customErrorMessageOnValidationError,
      },
    }
  )
  .add(
    'Loads forever',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        validateTenant={() => Promise.race([])}
      />
    ),
    {
      readme: {
        content: loadsForever,
      },
    }
  )
  .add(
    'Initial tenant',
    () => (
      <TenantSelector
        title="Example app"
        initialTenant="sample-tenant"
        onTenantSelected={action('onTenantSelected')}
      />
    ),
    {
      readme: {
        content: initialTenant,
      },
    }
  )
  .add(
    'Placeholder tenant',
    () => (
      <TenantSelector
        title="Example app"
        placeholder="Enter your company's CDP project name"
        onTenantSelected={action('onTenantSelected')}
      />
    ),
    {
      readme: {
        content: placeholderTenant,
      },
    }
  )
  .add(
    'Advanced options',
    () => (
      <TenantSelector
        title="Example app"
        onTenantSelected={action('onTenantSelected')}
        advancedOptions={{ apiUrl: '', comment: 'Comment' }}
      />
    ),
    {
      readme: {
        content: advancedOptions,
      },
    }
  )
  .add(
    'Custom Styles',
    () => (
      <TenantSelector
        title="Styled App"
        onTenantSelected={action('onTenantSelected')}
        advancedOptions={{ apiUrl: '', comment: 'Comment' }}
        styles={{
          title: {
            color: 'red',
            alignSelf: 'center',
            fontFamily: 'Comic Sans MS',
          },
          subTitle: {
            color: 'purple',
            alignSelf: 'center',
          },
          wrapper: {
            width: 400,
            backgroundColor: '#ffffa7',
            borderRadius: 30,
            boxShadow: 'none',
          },
          button: {
            width: 200,
            textTransform: 'none',
            alignSelf: 'center',
            borderRadius: 10,
            backgroundColor: 'magenta',
            color: 'white',
          },
          input: {
            borderRadius: 10,
            border: '2px solid #33DD33',
          },
          collapseWrapper: {
            backgroundColor: '#ffffa7',
          },
        }}
      />
    ),
    {
      readme: {
        content: customStyles,
      },
    }
  );
