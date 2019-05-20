import { Datapoint, Datapoints, TimeSeries } from '@cognite/sdk';
import { datapointsList, timeseriesList } from '../../mocks';
import { AccessorFunc, cogniteloader, mergeInsert } from './dataLoader';

TimeSeries.retrieve = jest.fn();
Datapoints.retrieve = jest.fn();

const toPoints = (arr: number[], from: string): Datapoint[] =>
  arr.map((d: number) => ({ timestamp: d, value: from }));

const xAccessor: AccessorFunc = (d: Datapoint) => d.timestamp;

// tslint:disable:no-big-function
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

  describe('cogniteloader', () => {
    beforeEach(() => {
      // @ts-ignore
      TimeSeries.retrieve.mockResolvedValue(timeseriesList[0]);
      // @ts-ignore
      Datapoints.retrieve.mockResolvedValue(datapointsList);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('reason MOUNTED', () => {
      test.each`
        pps      | expectedGranularity
        ${1}     | ${'2day'}
        ${10}    | ${'3h'}
        ${100}   | ${'15m'}
        ${1000}  | ${'2m'}
        ${10000} | ${'9s'}
      `(
        'Requests $expectedGranularity granularity when pointsPerSeries is $pps',
        async ({
          pps,
          expectedGranularity,
        }: {
          pps: number;
          expectedGranularity: string;
        }) => {
          const result = await cogniteloader({
            id: 123,
            timeDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
            timeSubDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
            pointsPerSeries: pps,
            oldSeries: {},
            reason: 'MOUNTED',
          });
          expect(Datapoints.retrieve).toHaveBeenCalledTimes(1);
          expect(Datapoints.retrieve).toHaveBeenCalledWith(
            123,
            expect.objectContaining({ granularity: expectedGranularity })
          );
          expect(result.drawPoints).toBeFalsy();
          expect(result.data).toEqual(datapointsList.datapoints);
        }
      );

      it('should draw raw data points if total number of points is less than half of pointsPerSeries', async () => {
        const datapoints: Datapoint[] = [
          {
            timestamp: 1552726800000,
            value: 36.26105251209135,
          },
          {
            timestamp: 1552734000000,
            value: 36.2421327365039,
          },
        ];
        // @ts-ignore
        Datapoints.retrieve.mockResolvedValue({ name: 'abc', datapoints });

        const startTime = Date.now() - 24 * 60 * 60 * 1000;
        const result = await cogniteloader({
          id: 123,
          timeDomain: [startTime, Date.now()],
          timeSubDomain: [startTime, Date.now()],
          pointsPerSeries: 2000000,
          oldSeries: {},
          reason: 'MOUNTED',
        });

        const expectedDatapoints: Datapoint[] = [
          {
            timestamp: 1552726800000,
            average: 36.26105251209135,
          },
          {
            timestamp: 1552734000000,
            average: 36.2421327365039,
          },
        ];

        expect(result.data).toEqual(expectedDatapoints);
        expect(result.drawPoints).toBeTruthy();
      });
    });

    describe('reason INTERVAL', () => {
      test.each`
        pps      | expectedGranularity
        ${1}     | ${'2day'}
        ${10}    | ${'3h'}
        ${100}   | ${'15m'}
        ${1000}  | ${'2m'}
        ${10000} | ${'9s'}
      `(
        'Requests $expectedGranularity granularity when pointsPerSeries is $pps',
        async ({
          pps,
          expectedGranularity,
        }: {
          pps: number;
          expectedGranularity: string;
          // tslint:disable-next-line: no-identical-functions
        }) => {
          const result = await cogniteloader({
            id: 123,
            timeDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
            timeSubDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
            pointsPerSeries: pps,
            oldSeries: {},
            reason: 'INTERVAL',
          });
          expect(Datapoints.retrieve).toHaveBeenCalledTimes(1);
          expect(Datapoints.retrieve).toHaveBeenCalledWith(
            123,
            expect.objectContaining({ granularity: expectedGranularity })
          );
          expect(result.drawPoints).toBeFalsy();
          expect(result.data).toEqual(datapointsList.datapoints);
        }
      );

      it('should fetch raw data when old series fetched raw data', async () => {
        const datapoints: Datapoint[] = [
          {
            timestamp: 1552726800000,
            value: 36.26105251209135,
          },
          {
            timestamp: 1552734000000,
            value: 36.2421327365039,
          },
        ];
        // @ts-ignore
        Datapoints.retrieve.mockResolvedValue({ name: 'abc', datapoints });

        const result = await cogniteloader({
          id: 123,
          timeDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
          timeSubDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
          pointsPerSeries: 200,
          oldSeries: {
            drawPoints: true,
          },
          reason: 'INTERVAL',
        });

        const expectedDatapoints: Datapoint[] = [
          {
            timestamp: 1552726800000,
            average: 36.26105251209135,
          },
          {
            timestamp: 1552734000000,
            average: 36.2421327365039,
          },
        ];

        expect(result.data).toEqual(expectedDatapoints);
        expect(result.drawPoints).toBeTruthy();
      });
    });

    describe('reason UPDATE_SUBDOMAIN', () => {
      it('should merge subdomain points', async () => {
        const mergeInsertImpl = mergeInsert;
        // @ts-ignore
        mergeInsert = jest.fn();
        // @ts-ignore
        mergeInsert.mockReturnValue(datapointsList.datapoints);

        const result = await cogniteloader({
          id: 123,
          timeDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
          timeSubDomain: [Date.now() - 24 * 60 * 60 * 1000, Date.now()],
          pointsPerSeries: 200,
          oldSeries: {},
          reason: 'UPDATE_SUBDOMAIN',
        });

        expect(Datapoints.retrieve).toHaveBeenCalledTimes(1);
        expect(result.drawPoints).toBeFalsy();
        expect(result.data).toEqual(datapointsList.datapoints);
        expect(mergeInsert).toHaveBeenCalledTimes(1);

        // @ts-ignore
        mergeInsert = mergeInsertImpl;
      });
    });
  });
});
