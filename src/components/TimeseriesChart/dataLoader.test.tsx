import { Datapoint } from '@cognite/sdk';
import { AccessorFunc, mergeInsert } from './dataLoader';

const toPoints = (arr: number[], from: string): Datapoint[] =>
  arr.map((d: number) => ({ timestamp: d, value: from }));

const xAccessor: AccessorFunc = (d: Datapoint) => d.timestamp;

describe('dataLoader', () => {
  describe('MergeInsert', () => {
    it('[base[0] <= toInsert[0] <= toInsert[1] <= base[1]]', () => {
      const base = toPoints([1, 5, 10, 15], 'base');
      const toInsert = toPoints([6, 7, 8], 'insert');
      const expectedOutput: Datapoint[] = [
        {
          timestamp: 1,
          value: 'base',
        },
        {
          timestamp: 6,
          value: 'insert',
        },
        {
          timestamp: 7,
          value: 'insert',
        },
        {
          timestamp: 8,
          value: 'insert',
        },
        {
          timestamp: 10,
          value: 'base',
        },
        {
          timestamp: 15,
          value: 'base',
        },
      ];
      const merged = mergeInsert(base, toInsert, xAccessor, [5, 8]);
      expect(merged).toEqual(expectedOutput);
    });

    it('Merge insert [empty base]', () => {
      const base = toPoints([], 'base');
      const toInsert = toPoints([1, 5], 'insert');
      const expectedOutput: Datapoint[] = [
        { timestamp: 1, value: 'insert' },
        { timestamp: 5, value: 'insert' },
      ];
      const merged = mergeInsert(base, toInsert, xAccessor, [0, 5]);
      expect(merged).toEqual(expectedOutput);
    });

    it('Merge insert [One insert point]', () => {
      const base = toPoints([1, 5], 'base');
      const toInsert = toPoints([5], 'insert');
      const expectedOutput: Datapoint[] = [
        { timestamp: 1, value: 'base' },
        { timestamp: 5, value: 'insert' },
      ];
      const merged = mergeInsert(base, toInsert, xAccessor, [3, 5]);
      expect(merged).toEqual(expectedOutput);
    });
  });
});
