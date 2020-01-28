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
import { randomData } from './timeseriesDataPointsList';
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

export const MockDatapointsClientObject = {
  retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
    const { granularity, start, end } = query.items[0];
    const result = randomData(
      (start && +start) || 0,
      (end && +end) || 0,
      100,
      granularity ? getGranularityInMS(granularity) : undefined
    );
    return [result];
  },
  retrieveLatest: async () => {
    await sleep(1000);
    return [
      {
        isString: false,
        id: 123,
        datapoints: [
          {
            timestamp: new Date(),
            value: 15 + Math.random() * 5.0,
          },
        ],
      },
    ];
  },
};

export class TimeseriesMockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any = MockDatapointsClientObject;
}
