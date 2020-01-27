import { AxisDisplayMode } from '@cognite/griff-react';
import React, { FC } from 'react';
import { FakeZoomableClient, TimeseriesMockClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DataLoader } from '../dataLoader';
import {
  TimeseriesChartBySeries,
  TimeseriesChartByTimeseriesId,
} from '../interfaces';

const mockDataConfig = [
  {
    id: 123,
    min: 0,
    max: 100,
    continousDeviation: 2,
    peakDeviation: 20,
    positivePeakPoints: 3,
  },
  {
    id: 456,
    min: 200,
    max: 400,
    continousDeviation: 3,
    peakDeviation: 30,
    negativePeakPoints: 6,
  },
];
const client = new TimeseriesMockClient({
  appId: 'gearbox test',
  mockDataConfig,
});

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
