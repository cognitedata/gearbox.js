import * as sdk from '@cognite/sdk';
import {
  DataDatapoints,
  Datapoint,
  Timeseries,
  TimeseriesWithCursor,
} from '@cognite/sdk';
import { DataProviderLoaderParams, Series } from '@cognite/griff-react';

interface GriffSeries {
  firstSeries: Datapoint[];
  subDomain: number[];
  granularity: string;
}

const SERIES_GETTERS: Map<string, GriffSeries> = new Map<string, GriffSeries>();

export declare type AccessorFunc = (point: Datapoint) => number;

const timeseries = {
  results: new Map<string, Promise<Timeseries>>(),
  requests: new Map<string, Promise<Timeseries>>(),
};

export const getSubdomain = (id: string) =>
  id ? (SERIES_GETTERS.get(id) || { subDomain: [0, 1] }).subDomain : [0, 1];

export const getGranularity = (id: string) =>
  id ? (SERIES_GETTERS.get(id) || { granularity: '1d' }).granularity : '1d';

export const yAccessor = (d: Datapoint) => {
  if (d.value !== undefined) {
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
  console.warn('No obvious y accessor for', d);
  return 0;
};

export const y0Accessor = (data: Datapoint) =>
  data.min ? data.min : yAccessor(data);

export const y1Accessor = (data: Datapoint) =>
  data.max ? data.max : yAccessor(data);

const calculateGranularity = (domain: number[], pps: number) => {
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

const getTimeSeries = (name: string): Promise<Timeseries> => {
  if (timeseries.requests.has(name)) {
    // @ts-ignore - We're checking for undefined with the "has" check.
    return timeseries.requests.get(name);
  }
  if (timeseries.results.has(name)) {
    // @ts-ignore - We're checking for undefined with the "has" check.
    return timeseries.results.get(name);
  }
  const promise = sdk.TimeSeries.list({ q: name }).then(
    (list: TimeseriesWithCursor) => {
      if (list.items.length === 0) {
        throw new Error(`Could not find a timeseries with name ${name}`);
      }
      const timeserie = list.items[0];
      timeseries.results = timeseries.results.set(
        name,
        Promise.resolve(timeserie)
      );
      timeseries.requests.delete(name);
      return timeserie;
    }
  );
  timeseries.requests = timeseries.requests.set(name, promise);
  return promise;
};

const getRawDataPoints = ({
  name,
  step,
  start,
  end,
  limit,
}: {
  name: string;
  step?: boolean;
  start: number;
  end: number;
  limit?: number;
}): Promise<Datapoint[]> =>
  sdk.Datapoints.retrieveByName(name, { start, end, limit }).then(
    (data: DataDatapoints) => {
      return data.datapoints.map((d: Datapoint) => ({
        [`${step ? 'stepInterpolation' : 'average'}`]: d.value,
        timestamp: d.timestamp,
      }));
    }
  );

export const mergeInsert = (
  base: Datapoint[],
  toInsert: Datapoint[],
  xAccessor: AccessorFunc,
  subDomain: number[]
) => {
  if (toInsert.length === 0) {
    return base;
  }
  // Remove the points from base within the subdoconstn
  const strippedBase: Datapoint[] = base.filter(
    point => xAccessor(point) < subDomain[0] || xAccessor(point) > subDomain[1]
  );
  return [...strippedBase, ...toInsert].sort(
    (a, b) => xAccessor(a) - xAccessor(b)
  );
};

const requestsInFlight: { [id: string]: boolean } = {};

export const cogniteloader = async ({
  id,
  timeDomain,
  timeSubDomain,
  pointsPerSeries,
  oldSeries,
  reason,
}: DataProviderLoaderParams) => {
  const baseDomain = timeDomain;
  const subDomain = timeSubDomain;
  const fetchDomain = (reason === 'MOUNTED' ? baseDomain : subDomain).map(
    Math.round
  );
  const granularity = calculateGranularity(fetchDomain, pointsPerSeries);
  if (reason === 'INTERVAL') {
    if (requestsInFlight[id]) {
      return oldSeries;
    }
    requestsInFlight[id] = true;
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
    const requestPromise: Promise<Datapoint[]> = oldSeries.drawPoints
      ? getRawDataPoints({
          name: id,
          start: startTime,
          end: Date.now(),
          step,
        })
      : sdk.Datapoints.retrieveByName(id, {
          start: startTime,
          end: Date.now(),
          granularity,
          aggregates: `min,max,${step ? 'stepInterpolation' : 'average'}`,
        }).then((data: DataDatapoints) => data.datapoints);
    const newDatapoints: Datapoint[] = await requestPromise;
    requestsInFlight[id] = false;
    if (oldData) {
      return { ...oldSeries, data: [...oldData, ...newDatapoints] };
    }
    return {
      ...oldSeries,
      data: newDatapoints,
    };
  }
  const seriesInfo = SERIES_GETTERS.get(id) || {
    firstSeries: [],
    subDomain,
    granularity,
  };
  if (fetchDomain[1] - fetchDomain[0] < 100) {
    // Zooming REALLY far in (1 ms end to end)
    return oldSeries;
  }
  return getTimeSeries(id).then((timeseriesResponse: Timeseries) => {
    const { isStep: step } = timeseriesResponse;
    return (
      sdk.Datapoints.retrieveByName(id, {
        granularity,
        aggregates: `${step ? 'step' : 'avg'},count,min,max`,
        start: fetchDomain[0],
        end: fetchDomain[1],
        limit: pointsPerSeries,
      })
        .then(async (items: DataDatapoints) => {
          const { datapoints: points } = items;
          if (
            points.reduce((p, c: Datapoint) => p + (c.count || 0), 0) <
            pointsPerSeries / 2
          ) {
            // If there are less than x points, show raw values
            const result = await getRawDataPoints({
              name: id,
              step,
              start: fetchDomain[0],
              end: fetchDomain[1],
              limit: pointsPerSeries,
            });
            let data = result;
            if (step && points.length) {
              // Use the last-known value from step-interpolation to create a fake point at the left-boundary
              if (data.length && points[0].timestamp < data[0].timestamp) {
                data = [points[0], ...data];
              } else if (!data.length) {
                data = [points[0]];
              }
            }
            return {
              data,
              drawPoints: true,
              step: !!step,
            };
          }
          return { data: points, step: !!step };
        })
        .then((newSeries: any) => {
          const { firstSeries } = seriesInfo;
          const { xAccessor } = oldSeries;
          if (reason === 'UPDATE_SUBDOMAIN') {
            const val = SERIES_GETTERS.get(id);
            SERIES_GETTERS.set(id, {
              ...val,
              firstSeries: val ? val.firstSeries : [],
              subDomain,
              granularity,
            });
            const data = mergeInsert(
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
            const val = SERIES_GETTERS.get(id);
            SERIES_GETTERS.set(id, {
              ...val,
              firstSeries: newSeries.data,
              subDomain,
              granularity,
            });
          }
          return { ...newSeries, yAccessor };
        })
        // Do not crash the app in case of error, just return no data
        .catch(() => {
          return { data: [], step };
        })
    );
  });
};
