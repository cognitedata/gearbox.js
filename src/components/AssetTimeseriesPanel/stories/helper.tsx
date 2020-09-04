// Copyright 2020 Cognite AS
import { Timeseries, CogniteAsyncIterator } from '@cognite/sdk';
import React, { FC } from 'react';
import {
  MockDatapointsClientObject,
  MockTimeseriesClientObject,
  sleep,
  timeseriesListV2,
  TimeseriesMockClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetTimeseriesPanelProps } from '../interfaces';

class CogniteClient extends TimeseriesMockClient {
  timeseries: any = {
    ...MockTimeseriesClientObject,
    list: (): CogniteAsyncIterator<Timeseries[]> => ({
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

export const handleAssetTimeseriesLoaded = (files: Timeseries[]) =>
  console.log(files);

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

export const ComponentProps: FC<AssetTimeseriesPanelProps> = ({
  strings = {
    noTimeseriesSign: 'No timeseries linked to this asset',
  },
}) => <>{strings}</>;
