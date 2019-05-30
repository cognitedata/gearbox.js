/* eslint-disable react/no-multi-comp */
import { storiesOf } from '@storybook/react';
import React from 'react';
import { timeseriesList } from '../../../mocks/timeseriesList';
import { setupMocks } from '../../TimeseriesChart/stories/TimeseriesChart.stories';
import { TimeseriesChartMeta } from '../TimeseriesChartMeta';

const timeseries = timeseriesList[0];

storiesOf('TimeseriesChartMeta', module).add(
  'Full description',
  () => {
    setupMocks();
    return <TimeseriesChartMeta timeseries={timeseries} />;
  },
  {
    readme: {
      content: '',
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
