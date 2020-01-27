import { DataProviderLoaderParams, Series } from '@cognite/griff-react';
import { CogniteClient } from '@cognite/sdk';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDatapoint,
  GetAggregateDatapoint,
  GetDoubleDatapoint,
  GetStringDatapoint,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';

interface GriffSeries {
  firstSeries: GetAggregateDatapoint[];
  subDomain: number[];
  granularity: string;
}

export declare type AccessorFunc = (point: GetAggregateDatapoint) => number;

export class DataLoader {
  static determineIfIsGetDoubleDatapoint(
    toBeDetermined: GetDoubleDatapoint | GetAggregateDatapoint
  ): toBeDetermined is GetDoubleDatapoint {
    if (typeof (toBeDetermined as GetDoubleDatapoint).value === 'number') {
      return true;
    }
    return false;
  }

  static yAccessor = (d: GetDoubleDatapoint | GetAggregateDatapoint) => {
    if (DataLoader.determineIfIsGetDoubleDatapoint(d)) {
      return +d.value;
    }
    if (d.stepInterpolation !== undefined) {
      return +d.stepInterpolation;
    }
    if (d.average !== undefined) {
      return +d.average;
    }
    // We can get here if we ask for a stepInterpolation
    // and there's no points in the range [0, t1]
    // where the domain asked for is [t0, t1]
    return 0;
  };

  static xAccessor = (d: GetDoubleDatapoint | GetAggregateDatapoint) => {
    return d.timestamp;
  };

  static y0Accessor = (data: GetAggregateDatapoint) =>
    data.min ? data.min : DataLoader.yAccessor(data);

  static y1Accessor = (data: GetAggregateDatapoint) =>
    data.max ? data.max : DataLoader.yAccessor(data);

  static calculateGranularity = (domain: number[], pps: number) => {
    const diff = domain[1] - domain[0];
    for (let i = 1; i <= 60; i += 1) {
      const points = diff / (1000 * i);
      if (points < pps) {
        return `${i === 1 ? '' : i}s`;
      }
    }
    for (let i = 1; i <= 60; i += 1) {
      const points = diff / (1000 * 60 * i);
      if (points < pps) {
        return `${i === 1 ? '' : i}m`;
      }
    }
    for (let i = 1; i < 24; i += 1) {
      const points = diff / (1000 * 60 * 60 * i);
      if (points < pps) {
        return `${i === 1 ? '' : i}h`;
      }
    }
    for (let i = 1; i < 100; i += 1) {
      const points = diff / (1000 * 60 * 60 * 24 * i);
      if (points < pps) {
        return `${i === 1 ? '' : i}day`;
      }
    }
    return 'day';
  };

  static mergeInsert = (
    base: GetAggregateDatapoint[],
    toInsert: GetAggregateDatapoint[],
    xAccessor: AccessorFunc,
    subDomain: number[]
  ) => {
    if (toInsert.length === 0) {
      return base;
    }

    // Remove the points from base within the subdoconstn
    const strippedBase: GetAggregateDatapoint[] = base.filter(
      point =>
        xAccessor(point) < subDomain[0] || xAccessor(point) > subDomain[1]
    );
    return [...strippedBase, ...toInsert].sort(
      (a, b) => xAccessor(a) - xAccessor(b)
    );
  };

  timeseries = {
    results: new Map<number, Promise<GetTimeSeriesMetadataDTO>>(),
    requests: new Map<number, Promise<GetTimeSeriesMetadataDTO>>(),
  };

  SERIES_GETTERS: Map<number, GriffSeries> = new Map<number, GriffSeries>();

  requestsInFlight: { [id: string]: boolean } = {};
  constructor(private sdkClient: CogniteClient) {}

  getSubdomain = (id: number) =>
    id
      ? (this.SERIES_GETTERS.get(id) || { subDomain: [0, 1] }).subDomain
      : [0, 1];

  getGranularity = (id: number) =>
    id
      ? (this.SERIES_GETTERS.get(id) || { granularity: '1d' }).granularity
      : '1d';

  getTimeSeries = (id: number): Promise<GetTimeSeriesMetadataDTO> => {
    if (this.timeseries.requests.has(id)) {
      // @ts-ignore - We're checking for undefined with the "has" check.
      return this.timeseries.requests.get(id);
    }
    if (this.timeseries.results.has(id)) {
      // @ts-ignore - We're checking for undefined with the "has" check.
      return this.timeseries.results.get(id);
    }
    const promise = this.sdkClient.timeseries
      .retrieve([{ id }])
      .then((timeseriesList: GetTimeSeriesMetadataDTO[]) => {
        this.timeseries.results = this.timeseries.results.set(
          id,
          Promise.resolve(timeseriesList[0])
        );
        this.timeseries.requests.delete(id);
        return timeseriesList[0];
      });
    this.timeseries.requests = this.timeseries.requests.set(id, promise);
    return promise;
  };

  getRawDataPoints = ({
    id,
    step,
    start,
    end,
    limit,
  }: {
    id: number;
    step?: boolean;
    start: number;
    end: number;
    limit?: number;
  }): Promise<GetAggregateDatapoint[]> =>
    this.sdkClient.datapoints
      .retrieve({
        items: [
          {
            id,
            start,
            end,
            limit,
          },
        ],
      })
      .then(
        (
          data: (DatapointsGetAggregateDatapoint | DatapointsGetDatapoint)[]
        ) => {
          const temp = (data[0].datapoints as unknown) as GetDoubleDatapoint[];
          return temp.map(
            (d: GetDoubleDatapoint): GetAggregateDatapoint => {
              return {
                [`${step ? 'stepInterpolation' : 'average'}`]: d.value,
                timestamp: d.timestamp,
              };
            }
          );
        }
      );

  cogniteloader = async ({
    id,
    timeDomain: baseDomain,
    timeSubDomain: subDomain,
    pointsPerSeries,
    oldSeries,
    reason,
  }: DataProviderLoaderParams) => {
    const fetchDomain = (reason === 'MOUNTED' ? baseDomain : subDomain).map(
      Math.round
    );
    const granularity = DataLoader.calculateGranularity(
      fetchDomain,
      pointsPerSeries
    );
    if (reason === 'INTERVAL') {
      if (this.requestsInFlight[id]) {
        return oldSeries;
      }
      this.requestsInFlight[id] = true;
      // Note: this pulls from the xDomain -- *not* the fetchDomain -- in
      // order to prevent the aggregate granularity from shifting while the data
      // is streaming in. If it was set to the fetchDomain, then it would change
      // constantly as the fetchDomain slides backwards.
      let startTime = baseDomain[0];
      const { xAccessor, data: oldData } = oldSeries;
      if (oldData && oldData.length > 0) {
        startTime = xAccessor(oldData[oldData.length - 1]) + 1;
      }
      const { step } = oldSeries;
      const requestPromise: Promise<
        GetAggregateDatapoint[]
      > = oldSeries.drawPoints
        ? this.getRawDataPoints({
            id,
            start: startTime,
            end: Date.now(),
            step,
          })
        : this.sdkClient.datapoints
            .retrieve({
              items: [
                {
                  id,
                  start: startTime,
                  end: Date.now(),
                  granularity,
                  aggregates: [
                    'count',
                    'min',
                    'max',
                    step ? 'stepInterpolation' : 'average',
                  ],
                },
              ],
            })
            .then(
              (
                data: (
                  | DatapointsGetAggregateDatapoint
                  | DatapointsGetDatapoint)[]
              ) => (data.length === 0 ? [] : data[0].datapoints)
            );
      const newDatapoints = (await requestPromise).map(
        (x: GetAggregateDatapoint) => ({
          ...x,
          timestamp: +x.timestamp,
        })
      );
      this.requestsInFlight[id] = false;
      if (oldData) {
        return { ...oldSeries, data: [...oldData, ...newDatapoints] };
      }
      return {
        ...oldSeries,
        data: newDatapoints,
      };
    }
    const seriesInfo = this.SERIES_GETTERS.get(id) || {
      firstSeries: [],
      subDomain,
      granularity,
    };
    if (fetchDomain[1] - fetchDomain[0] < 100) {
      // Zooming REALLY far in (1 ms end to end)
      return oldSeries;
    }
    return this.getTimeSeries(id).then(
      (timeseriesResponse: GetTimeSeriesMetadataDTO) => {
        const { isStep: step } = timeseriesResponse;
        return (
          this.sdkClient.datapoints
            .retrieve({
              items: [
                {
                  id,
                  granularity,
                  aggregates: [
                    'count',
                    'min',
                    'max',
                    step ? 'stepInterpolation' : 'average',
                  ],
                  start: fetchDomain[0],
                  end: fetchDomain[1],
                  limit: pointsPerSeries,
                },
              ],
            })
            .then(
              async (
                response: (
                  | DatapointsGetAggregateDatapoint
                  | DatapointsGetDatapoint)[]
              ) => {
                const { datapoints: points } = response[0];
                // @ts-ignore
                const numberOfPoints = points.reduce(
                  (
                    p: number,
                    c:
                      | GetAggregateDatapoint
                      | GetDoubleDatapoint
                      | GetStringDatapoint
                  ) => {
                    // @ts-ignore
                    return p + (c.count || 0);
                  },
                  0
                );
                if (numberOfPoints < pointsPerSeries / 2) {
                  // If there are less than x points, show raw values
                  let data = await this.getRawDataPoints({
                    id,
                    step,
                    start: fetchDomain[0],
                    end: fetchDomain[1],
                    limit: pointsPerSeries,
                  });
                  if (step && points.length) {
                    // Use the last-known value from step-interpolation to create a fake point at the left-boundary
                    if (
                      data.length &&
                      points[0].timestamp < data[0].timestamp
                    ) {
                      data = [points[0], ...data];
                    } else if (!data.length) {
                      data = [points[0]];
                    }
                  }
                  return {
                    data,
                    drawPoints: true,
                    step,
                  };
                }
                return {
                  // @ts-ignore
                  data: points.map((x: GetAggregateDatapoint) => ({
                    ...x,
                    timestamp: +x.timestamp,
                  })),
                  step,
                };
              }
            )
            .then((newSeries: any) => {
              const { firstSeries } = seriesInfo;
              const { xAccessor } = oldSeries;
              if (reason === 'UPDATE_SUBDOMAIN') {
                const val = this.SERIES_GETTERS.get(id);
                this.SERIES_GETTERS.set(id, {
                  ...val,
                  firstSeries: val ? val.firstSeries : [],
                  subDomain,
                  granularity,
                });
                const data = DataLoader.mergeInsert(
                  firstSeries,
                  newSeries.data,
                  xAccessor,
                  subDomain
                );
                return { ...newSeries, data };
              }
              return newSeries;
            })
            .then((newSeries: Series) => {
              if (reason === 'MOUNTED') {
                const val = this.SERIES_GETTERS.get(id);
                this.SERIES_GETTERS.set(id, {
                  ...val,
                  firstSeries: newSeries.data,
                  subDomain,
                  granularity,
                });
              }
              return { ...newSeries, yAccessor: DataLoader.yAccessor };
            })
            // Do not crash the app in case of error, just return no data
            .catch(() => {
              return { data: [], step };
            })
        );
      }
    );
  };
}
