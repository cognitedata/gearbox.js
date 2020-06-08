import { AxisDisplayMode } from '@cognite/griff-react';
import React, { FC } from 'react';
import { FakeZoomableClient, TimeseriesMockClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import {
  TimeseriesChartBySeries,
  TimeseriesChartByTimeseriesId,
} from '../interfaces';

const client = new TimeseriesMockClient({
  appId: 'gearbox test',
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
  },
  {
    id: 456,
    color: 'red',
  },
];

export const seriesWithCustomYdomain = [
  {
    id: 123,
    color: 'green',
    yAxisDisplayMode: AxisDisplayMode.ALL,
    hidden: false,
    ySubDomain: [-40, 40],
  },
  {
    id: 456,
    color: 'red',
    ySubDomain: [-50, 50],
  },
];

export const ySubDomains = { 123: [-40, 40] };

export const ysubDomainsForLiveUpdate = { 123: [-120, 120] };

export const TimeseriesIdsComponentProps: FC<
  TimeseriesChartByTimeseriesId
> = () => <></>;

export const SeriesComponentProps: FC<TimeseriesChartBySeries> = () => <></>;
