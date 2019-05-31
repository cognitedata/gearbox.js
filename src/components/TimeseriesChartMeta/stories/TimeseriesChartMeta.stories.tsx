/* eslint-disable react/no-multi-comp */
import { storiesOf } from '@storybook/react';
import React from 'react';
import { setupMocks } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { TimeseriesChartMeta } from '../TimeseriesChartMeta';

import customBasePeriod from './customBasePeriod.md';
import customInterval from './customInterval.md';
import disableUpdates from './disableUpdates.md';
import full from './full.md';
import hideElements from './hideElements.md';
import predefinedPeriod from './predefinedPeriod.md';

const ts = {
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
};

storiesOf('TimeseriesChartMeta', module).add(
  'Full description',
  () => {
    setupMocks();
    return <TimeseriesChartMeta timeseries={ts} />;
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
      setupMocks();
      return (
        <TimeseriesChartMeta timeseries={ts} defaultTimePeriod="lastMonth" />
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
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={ts}
          showChart={true}
          showDescription={false}
          showDatapoint={false}
          showMetadata={false}
          showPeriods={false}
        />
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
      setupMocks();
      return <TimeseriesChartMeta timeseries={ts} liveUpdate={false} />;
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
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={ts}
          liveUpdate={true}
          updateIntervalMillis={1000}
        />
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
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={ts}
          defaultBasePeriod={{
            startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
            endTime: Date.now(),
          }}
        />
      );
    },
    {
      readme: {
        content: customBasePeriod,
      },
    }
  );
