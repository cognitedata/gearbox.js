import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import { CogniteAsyncIterator } from '@cognite/sdk/dist/src/autoPagination';
import React from 'react';
import { sleep } from '../../../mocks';
import { timeseriesListV2 } from '../../../mocks/';
import {
  MockDatapointsClientObject,
  MockTimeseriesClientObject,
  TimeseriesMockClient,
} from '../../../mocks/datapoints';
import { ClientSDKProvider } from '../../ClientSDKProvider';

class CogniteClient extends TimeseriesMockClient {
  timeseries: any = {
    ...MockTimeseriesClientObject,
    list: (): CogniteAsyncIterator<GetTimeSeriesMetadataDTO[]> => ({
      // @ts-ignore TODO - remove this ts-ignore after fixing SDK
      autoPagingToArray: async () => {
        await sleep(1000);
        return timeseriesListV2;
      },
    }),
  };
  datapoints: any = {
    ...MockDatapointsClientObject,
    retrieveLatest: async () => {
      await sleep(1000);
      return [
        {
          isString: false,
          id: 123,
          datapoints: [
            {
              timestamp: new Date(Date.now()),
              value: 15 + Math.random() * 5.0,
            },
          ],
        },
      ];
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const handleAssetTimeseriesLoaded = (
  files: GetTimeSeriesMetadataDTO[]
) => console.log(files);

export const customStyle = {
  wrapper: {
    border: '2px red solid',
    width: '70%',
  },
  timeseriesContainer: {
    backgroundColor: '#efefef',
  },
};

export const metaOptions = {
  defaultTimePeriod: 'lastYear',
  liveUpdate: false,
  showChart: true,
  showDescription: false,
  showDatapoint: true,
  showMetadata: false,
  showPeriods: true,
};
