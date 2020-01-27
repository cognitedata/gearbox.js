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
import { getRandomdata, randomDataZoomable } from './timeseriesDataPointsList';
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

export interface MockChartDataConfig {
  id: number;
  min: number;
  max: number;
  continousDeviation: number;
  peakDeviation: number;
  negativePeakPoints?: number;
  positivePeakPoints?: number;
}

export const getMockDatapointsRetrieve = (
  config?: MockChartDataConfig[]
) => async (query: any): Promise<DatapointsArray> => {
  const { granularity, start, end, id } = query.items[0];
  const result = getRandomdata(
    id,
    (start && +start) || 0,
    (end && +end) || 0,
    100,
    granularity ? getGranularityInMS(granularity) : undefined,
    config
  );
  return [result];
};

export class TimeseriesMockClient extends MockCogniteClient {
  dataConfig?: MockChartDataConfig[];
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any;
  constructor(options: any) {
    super(options);
    const { mockDataConfig } = options;
    this.dataConfig = mockDataConfig;
    this.datapoints = {
      retrieve: getMockDatapointsRetrieve(this.dataConfig),
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
