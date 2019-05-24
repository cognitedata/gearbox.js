import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { generateNumber, sleep } from '../common';

configure({ adapter: new Adapter() });

describe('common', () => {
  describe('generateNumber', () => {
    it.each`
      genNumber    | expected
      ${undefined} | ${10}
      ${7}         | ${7}
    `(
      'Generates $expected digits-length number with argument $genNumber',
      ({ genNumber, expected }) => {
        expect(generateNumber(genNumber).toString().length).toBe(expected);
      }
    );

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
});
