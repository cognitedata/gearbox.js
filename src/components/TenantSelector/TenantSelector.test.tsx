import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';
import { ThemeProvider } from 'styled-components';
import { TenantSelector } from './TenantSelector';

configure({ adapter: new Adapter() });

describe('TenantSelector', () => {
  it('Renders without exploding', done => {
    const wrapper = mount(
      <TenantSelector
        onTenantSelected={done.fail}
        title="Unit Test"
        validateTenant={done.fail}
      />
    );
    expect(wrapper).toHaveLength(1);
    done();
  });

  const tenantName = 'example-tenant';
  const tenantInputDataId = 'input[data-id="tenant-input"]';
  it('Handles invalid tenants', done => {
    const validateTenant = sinon.fake.rejects(new Error('Testing'));
    const wrapper = mount(
      <TenantSelector
        onTenantSelected={done.fail}
        title="Unit Test"
        validateTenant={validateTenant}
      />
    );

    expect(wrapper).toHaveLength(1);
    const button = wrapper.find('button');
    button.simulate('click');
    const input = wrapper.find(tenantInputDataId);

    // Without any text entered, clicking the button doesn't do anything.
    expect(validateTenant.callCount).toEqual(0);
    input.simulate('change', { target: { value: tenantName } });
    button.simulate('click');
    expect(validateTenant.callCount).toEqual(1);
    expect(validateTenant.lastCall.args[0]).toEqual(tenantName);

    done();
  });

  it('Handles invalid tenants (with callback)', done => {
    const validateTenant = sinon.fake.rejects(new Error('Testing'));
    const onInvalidTenant = sinon.fake();
    const wrapper = mount(
      <TenantSelector
        onInvalidTenant={onInvalidTenant}
        onTenantSelected={done.fail}
        title="Unit Test"
        validateTenant={validateTenant}
      />
    );

    expect(wrapper).toHaveLength(1);
    const button = wrapper.find('button');
    button.simulate('click');
    const input = wrapper.find(tenantInputDataId);

    // Without any text entered, clicking the button doesn't do anything.
    expect(validateTenant.callCount).toEqual(0);
    input.simulate('change', { target: { value: tenantName } });
    button.simulate('click');
    expect(validateTenant.callCount).toEqual(1);
    expect(validateTenant.lastCall.args[0]).toEqual(tenantName);
    process.nextTick(() => {
      expect(onInvalidTenant.callCount).toEqual(1);
      expect(onInvalidTenant.lastCall.args[0]).toEqual(tenantName);
      done();
    });
  });

  it('Handles empty tenants (with callback)', done => {
    const wrapper = mount(
      <TenantSelector
        onInvalidTenant={() =>
          done.fail('onInvalidTenant should not be called without text')
        }
        onTenantSelected={() =>
          done.fail('onTenantSelected should not be called without text')
        }
        title="Unit Test"
        validateTenant={() =>
          done.fail('validateTenant should not be called without text')
        }
      />
    );

    expect(wrapper).toHaveLength(1);
    const button = wrapper.find('button');
    button.simulate('click');
    const input = wrapper.find(tenantInputDataId);

    // Without any text entered, clicking the button doesn't do anything.
    input.simulate('change', { target: { value: '' } });
    input.simulate('keydown', { keyCode: 13 });
    done();
  });

  it('Handles valid tenants', done => {
    const validateTenant = sinon.fake.resolves(true);
    const onTenantSelected = sinon.fake();
    const wrapper = mount(
      <TenantSelector
        onTenantSelected={onTenantSelected}
        title="Unit Test"
        validateTenant={validateTenant}
      />
    );

    expect(wrapper).toHaveLength(1);
    const button = wrapper.find('button');
    button.simulate('click');
    const input = wrapper.find(tenantInputDataId);

    // Without any text entered, clicking the button doesn't do anything.
    expect(validateTenant.callCount).toEqual(0);
    input.simulate('change', { target: { value: tenantName } });
    button.simulate('click');
    expect(validateTenant.callCount).toEqual(1);
    expect(validateTenant.lastCall.args[0]).toEqual(tenantName);
    process.nextTick(() => {
      expect(onTenantSelected.callCount).toEqual(1);
      expect(onTenantSelected.lastCall.args[0]).toEqual(tenantName);
      done();
    });
  });

  it('Advanced options rendering', () => {
    const apiUrlString = 'api';
    const advancedOptions = {
      apiUrl: '',
      comment: 'Comment',
    };
    const validateTenant = sinon.fake.resolves(true);
    const onTenantSelected = sinon.fake();
    const wrapper = mount(
      <TenantSelector
        title="Unit Test"
        onTenantSelected={onTenantSelected}
        validateTenant={validateTenant}
        advancedOptions={advancedOptions}
      />
    );

    expect(wrapper).toHaveLength(1);

    const collapseHeader = wrapper.find('.ant-collapse-header');

    collapseHeader.simulate('click');

    expect(wrapper.find('input')).toHaveLength(3);

    const button = wrapper.find('button');
    const input = wrapper.find(tenantInputDataId);
    const optionApiInput = wrapper.find('input[name="apiUrl"]');

    optionApiInput.simulate('change', { target: { value: apiUrlString } });
    input.simulate('change', { target: { value: tenantName } });
    button.simulate('click');

    expect(validateTenant.lastCall.args[1]).toMatchObject({
      apiUrl: apiUrlString,
      comment: 'Comment',
    });
  });

  it('renders with passed custom theme', () => {
    const onTenantSelected = sinon.fake();
    const themeExample = {
      custom: {
        primaryColor: 'orange',
        textColor: '#999',
        containerColor: '#F4F4F4',
        lightGrey: 'white',
        buttonDisabledColor: '#DDD',
        lightShadow: 'rgba(0, 0, 0, 0.15) 10px 10px 8px 8px',
      },
    };

    const wrapper = mount(
      <ThemeProvider theme={themeExample}>
        <TenantSelector title="Unit Test" onTenantSelected={onTenantSelected} />
      </ThemeProvider>
    );

    expect(wrapper).toHaveLength(1);
  });
});
