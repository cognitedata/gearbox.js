/* eslint-disable react/no-multi-comp */
import { AxisDisplayMode } from '@cognite/griff-react';
import { CogniteClient } from '@cognite/sdk';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk/dist/src/types/types';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Annotation } from '../../../@types/griff-react/index';
import { timeseriesListV2 } from '../../../mocks';
import { buildMockSdk } from '../../../utils/mockSdk';
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

const randomData = (
  start: number,
  end: number,
  n: number
): DatapointsGetAggregateDatapoint => {
  const data = [];
  const dt = (end - start) / n;
  for (let i = start; i <= end; i += dt) {
    const values = [0, 0, 0]
      .map(
        () =>
          Math.sin(i / 20) * 50 +
          Math.cos(Math.PI - i / 40) * 50 +
          Math.random() * 40
      )
      .sort((a: number, b: number) => a - b);
    data.push({
      timestamp: new Date(i),
      average: values[1],
      min: values[0],
      max: values[2],
      count: 7000,
    });
  }
  return { datapoints: data, id: 1337 };
};

export const fakeClient: CogniteClient = {
  // @ts-ignore
  timeseries: {
    retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([timeseriesListV2[0]]);
        }, 1000); // simulate load delay
      });
    },
  },
  // @ts-ignore
  datapoints: {
    retrieve: (
      query: DatapointsMultiQuery
    ): Promise<
      (
        | DatapointsGetAggregateDatapoint
        | DatapointsGetStringDatapoint
        | DatapointsGetDoubleDatapoint)[]
    > => {
      action('client.datapoints.retrieve')(query);
      return new Promise(resolve => {
        setTimeout(() => {
          const result = randomData(
            (query.items[0].start && +query.items[0].start) || 0,
            (query.items[0].end && +query.items[0].end) || 0,
            100
          );
          resolve([result]);
        });
      });
    },
  },
};

buildMockSdk(fakeClient);

const sdk = new CogniteClient({ appId: 'gearbox test' });

const fakeZoomableClient: CogniteClient = {
  // @ts-ignore
  timeseries: {
    // tslint:disable-next-line: no-identical-functions
    retrieve: (): Promise<GetTimeSeriesMetadataDTO[]> => {
      // tslint:disable-next-line: no-identical-functions
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([timeseriesListV2[0]]);
        }, 1000); // simulate load delay
      });
    },
  },
  // @ts-ignore
  datapoints: {
    retrieve: (
      query: DatapointsMultiQuery
    ): Promise<
      (
        | DatapointsGetAggregateDatapoint
        | DatapointsGetStringDatapoint
        | DatapointsGetDoubleDatapoint)[]
    > => {
      action('client.datapoints.retrieve')(query);
      return new Promise(resolve => {
        setTimeout(() => {
          const granularity = query.items[0].granularity || '10s';
          const n =
            granularity === 's' ? 2 : granularity.includes('s') ? 10 : 250;
          const result = randomData(
            (query.items[0].start && +query.items[0].start) || 0,
            (query.items[0].end && +query.items[0].end) || 100,
            n
          );
          resolve([result]);
        });
      });
    },
  },
};

buildMockSdk(fakeZoomableClient);

const zoomableSdk = new CogniteClient({ appId: 'gearbox test' });

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
            annotations={
              [
                {
                  data: [Date.now() - 30 * 1000, Date.now() - 20 * 1000],
                  height: 30,
                  id: 888,
                },
              ] as Annotation[]
            }
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
