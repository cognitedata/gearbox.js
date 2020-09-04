// Copyright 2020 Cognite AS
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { sanitizeTenant } from '../sanitize';

configure({ adapter: new Adapter() });

describe('sanitize', () => {
  it('Handles correct tenants', () => {
    expect(sanitizeTenant('abc')).toEqual('abc');
  });

  it('Handles uppercase tenants', () => {
    expect(sanitizeTenant('ABC')).toEqual('abc');
  });

  it('Handles tenants with numbers', () => {
    expect(sanitizeTenant('abc123')).toEqual('abc123');
  });

  it('Handles tenants with special characters', () => {
    expect(sanitizeTenant('a b c')).toEqual('abc');
    expect(sanitizeTenant('a B c')).toEqual('abc');
    expect(sanitizeTenant('a_b_c')).toEqual('abc');
    expect(sanitizeTenant('a1b2c3')).toEqual('a1b2c3');
    expect(sanitizeTenant('Cognite AS')).toEqual('cogniteas');
  });
});
