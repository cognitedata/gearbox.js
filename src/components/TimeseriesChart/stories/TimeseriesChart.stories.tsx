/* eslint-disable react/no-multi-comp */
import { AxisDisplayMode } from '@cognite/griff-react';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { randomData, timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient } from '../../../utils/mockSdk';
import { getGranularityInMS } from '../../../utils/utils';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DataLoader } from '../dataLoader';
import { TimeseriesChart } from '../TimeseriesChart';
import annotations from './annotations.md';
import collapsedYAxis from './collapsedYAxis.md';
import containerStyle from './containerStyle.md';
import contextChart from './contextChart.md';
import crosshair from './crosshair.md';
import customColors from './customColors.md';
import customSeries from './customSeries.md';
import empty from './empty.md';
import full from './full.md';
import heightAndWidth from './heightAndWidth.md';
import hidden from './hidden.md';
import leftYAxis from './leftYAxis.md';
import liveUpdate from './liveUpdate.md';
import mouseEvents from './mouseEvents.md';
import multiple from './multiple.md';
import noXAxis from './noXAxis.md';
import noYAxis from './noYAxis.md';
import ruler from './ruler.md';
import single from './single.md';
import startEnd from './startEnd.md';
import xAxisHeight from './xAxisHeight.md';
import zoomable from './zoomable.md';

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

const zoomableSdk = new FakeZoomableClient({ appId: 'gearbox test' });

storiesOf('TimeseriesChart', module).add(
  'Full description',
  () => {
    return (
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart timeseriesIds={[123]} />
      </ClientSDKProvider>
    );
  },
  {
    readme: {
      content: full,
    },
  }
);

storiesOf('TimeseriesChart/Examples', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .add(
    'Empty',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[]} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: empty,
      },
    }
  )
  .add(
    'Single',
    // tslint:disable-next-line: no-identical-functions
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: single,
      },
    }
  )
  .add(
    'Multiple',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123, 456]} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: multiple,
      },
    }
  )
  .add(
    'Hidden',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123, 456]}
            hiddenSeries={{ 123: true }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: hidden,
      },
    }
  )
  .add(
    'Height and width',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} height={300} width={800} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: heightAndWidth,
      },
    }
  )
  .add(
    'Custom container styles',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            styles={{
              container: { height: '300px', backgroundColor: 'lightblue' },
            }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: containerStyle,
      },
    }
  )
  .add(
    'Left y-axis',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} yAxisPlacement={'LEFT'} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: leftYAxis,
      },
    }
  )
  .add(
    'No y-axis',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} yAxisDisplayMode={'NONE'} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: noYAxis,
      },
    }
  )
  .add(
    'Collapsed y-axis',
    // tslint:disable-next-line: no-identical-functions
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            yAxisDisplayMode={'COLLAPSED'}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: collapsedYAxis,
      },
    }
  )
  .add(
    'X-axis height',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} xAxisHeight={100} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: xAxisHeight,
      },
    }
  )
  .add(
    'No x-axis',
    // tslint:disable-next-line: no-identical-functions
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} xAxisHeight={0} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: noXAxis,
      },
    }
  )
  .add(
    'Start and end time',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={new Date(2019, 3, 1)}
            endTime={new Date(2019, 4, 1)}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: startEnd,
      },
    }
  )
  .add(
    'Crosshair',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} crosshair={true} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: crosshair,
      },
    }
  )
  .add(
    'Context chart',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart timeseriesIds={[123]} contextChart={true} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: contextChart,
      },
    }
  )
  .add(
    'Zoomable',
    () => {
      return (
        <ClientSDKProvider client={zoomableSdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={Date.now() - 30 * 24 * 60 * 60 * 1000}
            endTime={Date.now()}
            zoomable={true}
            contextChart={true}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: zoomable,
      },
    }
  )
  .add(
    'Live update',
    () => {
      return (
        <ClientSDKProvider client={zoomableSdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={Date.now() - 60 * 1000}
            endTime={Date.now()}
            liveUpdate={true}
            updateIntervalMillis={2000}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: liveUpdate,
      },
    }
  )
  .add(
    'Custom colors',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123, 456]}
            timeseriesColors={{ 123: 'red', 456: '#00ff00' }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customColors,
      },
    }
  )
  .add(
    'Annotations',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={Date.now() - 60 * 1000}
            endTime={Date.now()}
            // @ts-ignore
            annotations={[
              {
                data: [Date.now() - 30 * 1000, Date.now() - 20 * 1000],
                height: 30,
                id: 888,
              },
            ]}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: annotations,
      },
    }
  )
  .add(
    'Ruler',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={Date.now() - 60 * 1000}
            endTime={Date.now()}
            ruler={{
              visible: true,
              yLabel: (point: any) =>
                `${Number.parseFloat(point.value).toFixed(3)}`,
              timeLabel: (point: any) => point.timestamp.toString(),
            }}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: ruler,
      },
    }
  )
  .add(
    'Mouse events',
    () => {
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart
            timeseriesIds={[123]}
            startTime={Date.now() - 60 * 1000}
            endTime={Date.now()}
            onMouseMove={(e: any) => action('onMouseMove')(e)}
            onMouseOut={(e: any) => action('onMouseOut')(e)}
            onBlur={(e: any) => action('onBlur')(e)}
          />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: mouseEvents,
      },
    }
  )
  .add(
    'Custom series',
    () => {
      const series = [
        {
          id: 123,
          color: 'green',
          yAxisDisplayMode: AxisDisplayMode.ALL,
          hidden: false,
          y0Accessor: DataLoader.y0Accessor,
          y1Accessor: DataLoader.y1Accessor,
          yAccessor: DataLoader.yAccessor,
        },
        {
          id: 456,
          color: 'red',
          y0Accessor: DataLoader.y0Accessor,
          y1Accessor: DataLoader.y1Accessor,
          yAccessor: DataLoader.yAccessor,
        },
      ];
      return (
        <ClientSDKProvider client={sdk}>
          <TimeseriesChart series={series} yAxisDisplayMode={'NONE'} />
        </ClientSDKProvider>
      );
    },
    {
      readme: {
        content: customSeries,
      },
    }
  );
