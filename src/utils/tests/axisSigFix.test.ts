import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { decimalTickFormatter } from '../axisSigFix';

configure({ adapter: new Adapter() });

describe('axisSigFix', () => {
  it.each`
    tick    | ticks        | expected
    ${1.23} | ${[0]}       | ${'1'}
    ${1.23} | ${[0.12345]} | ${'1.23000'}
  `(
    'Fortmats number without decimal part and to 5 digits after decimal point',
    ({ tick, ticks, expected }) => {
      expect(decimalTickFormatter(tick, ticks)).toBe(expected);
    }
  );

  it('Counts max digits after decimal point to format among ticks', () => {
    const tick = 1.23;
    const ticks = [0.1234, 0.12, 0.123, 0.1];
    expect(decimalTickFormatter(tick, ticks)).toEqual('1.2300');
  });
});
