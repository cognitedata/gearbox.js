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
import { RandomDataStateFul } from './timeseriesDataPointsList';
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

const randomDataStateFul = new RandomDataStateFul();

export const MockDatapointsClientObject = {
  retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
    console.log('client.datapoints.retrieve', query);
    const { granularity, start, end } = query.items[0];
    const result = randomDataStateFul.getrandomData(
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
