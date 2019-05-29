import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  clampNumber,
  extractValidStrings,
  sortStringsAlphabetically,
} from '../utils';

configure({ adapter: new Adapter() });

describe('utils', () => {
  describe('clampNumber', () => {
    it('should return max if the value is greater than max', () => {
      expect(clampNumber(10, 0, 5)).toBe(5);
    });

    it('should return min if the value is less than min', () => {
      expect(clampNumber(-5, 0, 5)).toBe(0);
    });

    it('should return same value if the it is in min/max range', () => {
      expect(clampNumber(2, 0, 5)).toBe(2);
    });
  });

  describe('sortStringsAlphabetically', () => {
    it('sort strings alphabetically', () => {
      const arr = ['ccc', 'zzz', 'aaa', 'bbb'];
      arr.sort(sortStringsAlphabetically);

      expect(arr).toEqual(['aaa', 'bbb', 'ccc', 'zzz']);
    });
  });

  describe('extractValidStrings', () => {
    const arr = [
      {
        id: 229468419218757,
        description: 'Sea water system',
      },
      {
        id: 4652973256993338,
        description: 'Main pump for system 11',
      },
      {
        id: 1184192428522618,
        description: 'Heating cable for pump A',
      },
      {
        id: 8652613591094498,
        description: 'Backup pump for system 11',
      },
    ];

    it.each`
      minLen       | maxLen       | expected
      ${undefined} | ${undefined} | ${['Sea water system']}
      ${24}        | ${30}        | ${['Backup pump for system 11']}
    `(
      'Filters responce strings length from 5 to 20 chars and with custom from $minLen to $maxLen',
      ({ minLen, maxLen, expected }) => {
        expect(extractValidStrings(arr, maxLen, minLen)).toEqual(expected);
      }
    );
  });
});
