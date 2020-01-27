import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import React, { FC } from 'react';
import {
  getMockDatapointsRetrieve,
  sleep,
  TimeseriesMockClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesChartMetaProps } from '../interfaces';

class CogniteClient extends TimeseriesMockClient {
  timeseries: any = {
    retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
      await sleep(1000);
      return [
        {
          id: 8681821313339919,
          name: 'IA_21PT1019.AlarmByte',
          isString: false,
          unit: 'bar',
          metadata: {
            tag: 'IA_21PT1019.AlarmByte',
            scan: '1',
            span: '100',
            step: '1',
            zero: '0',
          },
          assetId: 4965555138606429,
          isStep: false,
          description: '21PT1019.AlarmByte',
          createdTime: new Date(0),
          lastUpdatedTime: new Date(0),
        },
      ];
    },
  };
  datapoints: any = {
    retrieve: getMockDatapointsRetrieve(),
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

export const defaultBasePeriodProps = {
  startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
  endTime: Date.now(),
};

export const exampleTheme = {
  gearbox: {
    textColor: 'Red',
    textColorSecondary: 'Coral',
  },
};

export const ComponentProps: FC<TimeseriesChartMetaProps> = () => <></>;
