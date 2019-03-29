import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import sinon from 'sinon';
import TenantSelector from './TenantSelector';

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
    input.simulate('change', { target: { value: '' } });
    input.simulate('keydown', { keyCode: 13 });
    expect(validateTenant.callCount).toEqual(0);
    expect(onInvalidTenant.callCount).toEqual(1);
    expect(onInvalidTenant.lastCall.args[0]).toEqual('');
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
});
