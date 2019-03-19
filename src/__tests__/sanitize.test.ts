import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { sanitizeTests } from '../sanitize';

configure({ adapter: new Adapter() });

describe('sanitize', () => {
  it('Handles correct tenants', () => {
    expect(sanitizeTests('abc')).toEqual('abc');
  });

  it('Handles uppercase tenants', () => {
    expect(sanitizeTests('ABC')).toEqual('abc');
  });

  it('Handles tenants with numbers', () => {
    expect(sanitizeTests('abc123')).toEqual('abc123');
  });

  it('Handles tenants with special characters', () => {
    expect(sanitizeTests('a b c')).toEqual('abc');
    expect(sanitizeTests('a B c')).toEqual('abc');
    expect(sanitizeTests('a_b_c')).toEqual('abc');
    expect(sanitizeTests('a1b2c3')).toEqual('a1b2c3');
    expect(sanitizeTests('Cognite AS')).toEqual('cogniteas');
  });
});
