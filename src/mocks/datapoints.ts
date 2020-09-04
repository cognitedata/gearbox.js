// Copyright 2020 Cognite AS
import {
  DatapointAggregates,
  DoubleDatapoint,
  StringDatapoint,
  DatapointsMultiQuery,
  Timeseries,
} from '@cognite/sdk';
import { getGranularityInMS } from '../utils/utils';
import { sleep } from './common';
import { MockCogniteClient } from './mockSdk';
import { randomData } from './timeseriesDataPointsList';
import { timeseriesListV2 } from './timeseriesListV2';

export type DatapointsArray = (
  | DatapointAggregates
  | StringDatapoint
  | DoubleDatapoint)[];

export const MockTimeseriesClientObject = {
  retrieve: async (): Promise<Timeseries[]> => {
    await sleep(1000);
    return [timeseriesListV2[0]];
  },
};

export const MockDatapointsClientObject = {
  retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
    console.log('client.datapoints.retrieve', query);
    const { granularity, start, end } = query.items[0];
    const result = randomData(
      (start && +start) || 0,
      (end && +end) || 0,
      100,
      granularity ? getGranularityInMS(granularity) : undefined
    );
    return [result];
  },
};

export class TimeseriesMockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any = MockDatapointsClientObject;
}
