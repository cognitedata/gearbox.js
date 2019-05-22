import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { generateNumber, sleep } from '../common';

configure({ adapter: new Adapter() });

describe('generateNumber', () => {
  it('Generates 10 digits number without argument', () => {
    expect(generateNumber().toString().length).toEqual(10);
  });

  it('Returns argument-length number on argument <= 15', () => {
    expect(generateNumber(7).toString().length).toEqual(7);
  });

  it('Returns 0 on argument > 15', () => {
    expect(generateNumber(16)).toEqual(0);
  });
});

describe('sleep', () => {
  jest.useFakeTimers();
  it('Resolve promise immediately', () => {
    sleep(0);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
  });

  it('Resolve promise in 1 second', () => {
    sleep(1000);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
