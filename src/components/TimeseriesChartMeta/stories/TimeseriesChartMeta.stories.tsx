/* eslint-disable react/no-multi-comp */
import { storiesOf } from '@storybook/react';
import React from 'react';
import { timeseriesList } from '../../../mocks/timeseriesList';
import { setupMocks } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { TimeseriesChartMeta } from '../TimeseriesChartMeta';

import full from './full.md';

const timeseries = timeseriesList[0];

storiesOf('TimeseriesChartMeta', module).add(
  'Full description',
  () => {
    setupMocks();
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
        <TimeseriesChartMeta
          timeseries={timeseries}
          defaultTimePeriod="lastMonth"
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  )
  .add(
    'Hide elements',
    () => {
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={timeseries}
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
        content: '',
      },
    }
  )
  .add(
    'Disable live updates',
    () => {
      setupMocks();
      return <TimeseriesChartMeta timeseries={timeseries} liveUpdate={false} />;
    },
    {
      readme: {
        content: '',
      },
    }
  )
  .add(
    'Custom update interval',
    () => {
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={timeseries}
          liveUpdate={true}
          updateIntervalMillis={1000}
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  )
  .add(
    'Custom base period',
    () => {
      setupMocks();
      return (
        <TimeseriesChartMeta
          timeseries={timeseries}
          defaultBasePeriod={{
            startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
            endTime: Date.now(),
          }}
        />
      );
    },
    {
      readme: {
        content: '',
      },
    }
  );
