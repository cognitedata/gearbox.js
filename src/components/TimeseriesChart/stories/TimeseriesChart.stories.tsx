/* eslint-disable react/no-multi-comp */
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { randomData, timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { getGranularityInMS } from '../../../utils/utils';

export const MockTimeseriesClientObject = {
  retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([timeseriesListV2[0]]);
      }, 1000); // simulate load delay
    });
  },
};
export const MockDatapointsClientObject = {
  retrieve: (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
    action('client.datapoints.retrieve')(query);
    const { granularity, start, end } = query.items[0];
    return new Promise(resolve => {
      setTimeout(() => {
        const result = randomData(
          (start && +start) || 0,
          (end && +end) || 0,
          100,
          granularity ? getGranularityInMS(granularity) : undefined
        );
        resolve([result]);
      });
    });
  },
};

type DatapointsArray = (
  | DatapointsGetAggregateDatapoint
  | DatapointsGetStringDatapoint
  | DatapointsGetDoubleDatapoint)[];

export class TimeseriesMockClient extends MockCogniteClient {
  timeseries: any = MockTimeseriesClientObject;
  datapoints: any = MockDatapointsClientObject;
}

const sdk = new TimeseriesMockClient({ appId: 'gearbox test' });

// tslint:disable-next-line: max-classes-per-file
class FakeZoomableClient extends MockCogniteClient {
  timeseries: any = {
    // tslint:disable-next-line: no-identical-functions
    retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
      // tslint:disable-next-line: no-identical-functions
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([timeseriesListV2[0]]);
        }, 1000); // simulate load delay
      });
    },
  };
  datapoints: any = {
    retrieve: (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
      action('client.datapoints.retrieve')(query);
      const { granularity = '10s', start, end } = query.items[0];
      return new Promise(resolve => {
        setTimeout(() => {
          const n =
            granularity === 's' ? 2 : granularity.includes('s') ? 10 : 250;
          const result = randomData(
            (start && +start) || 0,
            (end && +end) || 100,
            n
          );
          resolve([result]);
        });
      });
    },
  };
}
