import { AxisDisplayMode } from '@cognite/griff-react';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import React, { FC } from 'react';
import {
  MockCogniteClient,
  randomData,
  sleep,
  timeseriesListV2,
  TimeseriesMockClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DataLoader } from '../dataLoader';
import {
  TimeseriesChartBySeries,
  TimeseriesChartByTimeseriesId,
} from '../interfaces';

type DatapointsArray = (
  | DatapointsGetAggregateDatapoint
  | DatapointsGetStringDatapoint
  | DatapointsGetDoubleDatapoint)[];

class FakeZoomableClient extends MockCogniteClient {
  timeseries: any = {
    // tslint:disable-next-line: no-identical-functions
    retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
      // tslint:disable-next-line: no-identical-functions
      await sleep(1000);
      return [timeseriesListV2[0]];
    },
  };
  datapoints: any = {
    retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
      const { granularity = '10s', start, end } = query.items[0];
      const n = granularity === 's' ? 2 : granularity.includes('s') ? 10 : 250;
      const result = randomData(
        (start && +start) || 0,
        (end && +end) || 100,
        n
      );
      return [result];
    },
  };
}

const client = new TimeseriesMockClient({ appId: 'gearbox test' });

const zoomableClient = new FakeZoomableClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const zoomableClientDecorator = (storyFn: any) => (
  <ClientSDKProvider client={zoomableClient}>{storyFn()}</ClientSDKProvider>
);

export const customContainerStyle = {
  container: { height: '300px', backgroundColor: 'lightblue' },
};

export const timeSeriesColors = { 123: 'red', 456: '#00ff00' };

export const rulerProp = {
  visible: true,
  yLabel: (point: any) => `${Number.parseFloat(point.value).toFixed(3)}`,
  timeLabel: (point: any) => point.timestamp.toString(),
};

export const handleMouseMove = (e: any) => console.log('onMouseMove', e);

export const handleMouseOut = (e: any) => console.log('onMouseOut', e);

export const handleBlur = (e: any) => console.log('onBlur', e);

export const series = [
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

export const TimeseriesIdsComponentProps: FC<
  TimeseriesChartByTimeseriesId
> = () => <></>;
export const SeriesComponentProps: FC<TimeseriesChartBySeries> = () => <></>;
