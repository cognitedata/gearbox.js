import { Asset } from '@cognite/sdk';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  clampNumber,
  extractValidStrings,
  scaleCropSizeToVideoResolution,
  scaleDomToVideoResolution,
  shouldScaleYAxis,
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
        expect(
          extractValidStrings((arr as any) as Asset[], maxLen, minLen)
        ).toEqual(expected);
      }
    );
  });

  describe('WebCamCropper', () => {
    describe('Camera direction', () => {
      it('should be horizontal', () => {
        expect(shouldScaleYAxis(720, 1280, 1029, 1631)).toBeTruthy();
      });
      it('should be vertical', () => {
        expect(shouldScaleYAxis(720, 1280, 1029, 1948)).toBeFalsy();
      });
    });

    describe('AdjustCropSizeToVideoResolution', () => {
      it('should return undefined when cropsize is undefined', () => {
        expect(
          scaleCropSizeToVideoResolution(0, 0, 0, 0, undefined)
        ).toBeUndefined();
      });
      const cropSize = { width: 400, height: 200 };
      it('should scale 1 to 1', () => {
        const px = 1000;
        const scaled = scaleCropSizeToVideoResolution(px, px, px, px, cropSize);
        expect(scaled).toEqual({ width: 400, height: 200 });
      });

      it('should scale 1 to 2', () => {
        const px = 1000;
        const scaled = scaleCropSizeToVideoResolution(
          px / 2,
          px / 2,
          px,
          px,
          cropSize
        );
        expect(scaled).toEqual({ width: 200, height: 100 });
      });
    });

    describe('ScaleDomToVideoResolution', () => {
      it('should scale correctly', () => {
        const scaled = scaleDomToVideoResolution(10, 10, 20, 20);
        expect(scaled).toBeDefined();
      });
      it('should scale horizontaly with height but not width', () => {
        const sourceClientWidth = 1154;
        const sourceClientHeight = 1029;
        const scaled = scaleDomToVideoResolution(
          720,
          1280,
          sourceClientHeight,
          sourceClientWidth
        );
        expect(scaled).toEqual({
          clientHeight: 649, // this is scaled
          clientWidth: sourceClientWidth,
        });
      });
      it('should scale vertically with width but not height', () => {
        const sourceClientWidth = 2000;
        const sourceClientHeight = 1001;
        const scaled = scaleDomToVideoResolution(
          720,
          1280,
          sourceClientHeight,
          sourceClientWidth
        );
        expect(scaled).toEqual({
          clientHeight: sourceClientHeight,
          clientWidth: 1780, // this is scaled
        });
      });
    });
  });
});
