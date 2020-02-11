import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import { getGranularityInMS } from '../utils/utils';
import { sleep } from './common';
import { MockCogniteClient } from './mockSdk';
import { randomData, randomDataZoomable } from './timeseriesDataPointsList';
import { timeseriesListV2 } from './timeseriesListV2';

export type DatapointsArray = (
  | DatapointsGetAggregateDatapoint
  | DatapointsGetStringDatapoint
  | DatapointsGetDoubleDatapoint)[];

export const MockTimeseriesClientObject = {
  retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
    await sleep(1000);
    return [timeseriesListV2[0]];
  },
};

export const MockDatapointsRetrieve = async (
  query: DatapointsMultiQuery
): Promise<DatapointsArray> => {
  const { granularity, start, end } = query.items[0];
  const result = randomData(
    (start && +start) || 0,
    (end && +end) || 0,
    100,
    granularity ? getGranularityInMS(granularity) : undefined
  );
  return [result];
};

export class TimeseriesMockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any;
  constructor(options: any) {
    super(options);
    this.datapoints = {
      retrieve: MockDatapointsRetrieve,
    };
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FakeZoomableClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
      await sleep(1000);
      return [timeseriesListV2[0]];
    },
  };
  datapoints: any = {
    retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
      const { granularity = '10s', start, end } = query.items[0];
      const n = granularity === 's' ? 2 : granularity.includes('s') ? 10 : 250;
      const result = randomDataZoomable(
        (start && +start) || 0,
        (end && +end) || 100,
        n
      );
      return [result];
    },
  };
}
