/* eslint-disable react/no-multi-comp */
import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk-alpha/dist/src/types/types';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { fakeClient as timeseriesChartFakeClient } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { TimeseriesChartMeta } from '../TimeseriesChartMeta';

import customBasePeriod from './customBasePeriod.md';
import customInterval from './customInterval.md';
import disableUpdates from './disableUpdates.md';
import full from './full.md';
import hideElements from './hideElements.md';
import predefinedPeriod from './predefinedPeriod.md';

const fakeClient: API = {
  ...timeseriesChartFakeClient,
  // @ts-ignore
  timeseries: {
    retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
      return new Promise(resolve => {
        setTimeout(
          () =>
            resolve([
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
            ]),
          1000
        );
      });
    },
  },
};

storiesOf('TimeseriesChartMeta', module).add(
  'Full description',
  () => {
    return (
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMeta timeseriesId={123} />
      </ClientSDKProvider>
    );
  },
  {
    readme: {
      content: full,
    },
  }
);

storiesOf('TimeseriesChartMeta/Examples', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .add(
    'Predefined Period',
    () => {
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesChartMeta
            timeseriesId={123}
            defaultTimePeriod="lastMonth"
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: predefinedPeriod,
      },
    }
  )
  .add(
    'Hide elements',
    () => {
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesChartMeta
            timeseriesId={123}
            showChart={true}
            showDescription={false}
            showDatapoint={false}
            showMetadata={false}
            showPeriods={false}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: hideElements,
      },
    }
  )
  .add(
    'Disable live updates',
    () => {
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesChartMeta timeseriesId={123} liveUpdate={false} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: disableUpdates,
      },
    }
  )
  .add(
    'Custom update interval',
    () => {
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesChartMeta
            timeseriesId={123}
            liveUpdate={true}
            updateIntervalMillis={1000}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customInterval,
      },
    }
  )
  .add(
    'Custom base period',
    () => {
      return (
        <ClientSDKProvider client={fakeClient}>
          <TimeseriesChartMeta
            timeseriesId={123}
            defaultBasePeriod={{
              startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
              endTime: Date.now(),
            }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customBasePeriod,
      },
    }
  );
