import { AxisDisplayMode } from '@cognite/griff-react';
import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  DatapointsGetStringDatapoint,
  DatapointsMultiQuery,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
import { Button, DatePicker, Row, Tag } from 'antd';
import { Moment } from 'moment';
import React, { FC, SyntheticEvent, useState } from 'react';
import {
  MockCogniteClient,
  randomData,
  sleep,
  timeseriesListV2,
  TimeseriesMockClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DataLoader } from '../dataLoader';
import { TimeseriesChartProps, TimeseriesChartSeries } from '../interfaces';
import { TimeseriesChart } from '../TimeseriesChart';

type DatapointsArray = (
  | DatapointsGetAggregateDatapoint
  | DatapointsGetStringDatapoint
  | DatapointsGetDoubleDatapoint)[];

class FakeZoomableClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: async (): Promise<GetTimeSeriesMetadataDTO[]> => {
      await sleep(1000);
      return [timeseriesListV2[0]];
    },
  };
  datapoints: any = {
    retrieve: async (query: DatapointsMultiQuery): Promise<DatapointsArray> => {
      console.log('client.datapoints.retrieve', query);
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

export const seriesWithCustomYDomain = [
  {
    id: 123,
    color: 'green',
    yAxisDisplayMode: AxisDisplayMode.ALL,
    hidden: false,
    ySubDomain: [-150, 150],
  },
  {
    id: 456,
    color: 'red',
    ySubDomain: [-120, 120],
  },
];

export const ySubDomains = { 123: [-130, 130] };

export const TimeseriesComponent: FC<TimeseriesChartProps> = () => <></>;

const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;

export const DynamicSeries: FC = () => {
  const [series, setSeries] = useState<TimeseriesChartSeries[]>([]);
  const [end, setEnd] = useState<number>(Date.now());
  const [start, setStart] = useState<number>(end - 60 * 60 * 1000);
  const ruler = { visible: true };

  const onTimeRangeChanged = (range: (Moment | undefined)[]) => {
    const [start, end] = range;
    if (start) {
      setStart(+start);
    }
    if (end) {
      setEnd(+end);
    }
  };

  const toggleSeries = (index: number) => {
    series[index].hidden = !series[index].hidden;
    setSeries([...series]);
  };

  const pushSeries = (e: SyntheticEvent) => {
    e.preventDefault();

    setSeries([...series.concat({ id: series.length })]);
  };

  const popSeries = (e: SyntheticEvent) => {
    e.preventDefault();

    setSeries([...series.slice(0, -1)]);
  };

  return (
    <div style={{ width: '100%' }}>
      <Row>
        <RangePicker onChange={onTimeRangeChanged} />
        <Button onClick={pushSeries}>Push Series</Button>
        <Button onClick={popSeries}>Pop Series</Button>
      </Row>
      <Row style={{ marginTop: '5px' }}>
        <span>Series to render (hide/show on click):</span>
        {series.map((s, i) => (
          <CheckableTag
            key={s.id}
            onChange={() => toggleSeries(i)}
            checked={!s.hidden}
          >
            {s.id}
          </CheckableTag>
        ))}
      </Row>
      <div>
        <TimeseriesChart
          series={series}
          start={start}
          end={end}
          ruler={ruler}
          zoomable={true}
          contextChart={true}
        />
      </div>
    </div>
  );
};
