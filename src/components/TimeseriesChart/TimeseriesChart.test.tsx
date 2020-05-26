import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { datapointsList, sleep, timeseriesListV2 } from '../../mocks';
import { MockCogniteClient } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { CursorOverview } from './components/CursorOverview';
import { ChartRulerPoint } from './interfaces';
import { TimeseriesChart } from './TimeseriesChart';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: jest.fn(),
  };
  datapoints: any = {
    retrieve: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  sdk.timeseries.retrieve.mockResolvedValue([timeseriesListV2[0]]);
  sdk.datapoints.retrieve.mockResolvedValue([datapointsList]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesChart', () => {
  it('calls the sdk', async () => {
    const id = 123;
    const props = {
      timeseriesIds: [id],
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(sdk.timeseries.retrieve).toHaveBeenCalledTimes(1);
    expect(sdk.timeseries.retrieve).toHaveBeenCalledWith([{ id }]);
    expect(sdk.datapoints.retrieve).toHaveBeenCalledTimes(1);
    expect(sdk.datapoints.retrieve).toHaveBeenCalledWith({
      items: [expect.objectContaining({ id })],
    });
    expect(wrapper.find(CursorOverview).exists()).toBeFalsy();
  });

  it('renders correctly when ids are specified', async () => {
    const props = {
      timeseriesIds: [timeseriesListV2[0].id],
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(wrapper.find('.line').exists()).toBeTruthy();
  });

  it('renders correctly when series are specified', async () => {
    const props = {
      series: [
        {
          id: 123,
          color: 'green',
        },
      ],
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(wrapper.find('.line').exists()).toBeTruthy();
  });

  it('renders context chart', async () => {
    const props = {
      timeseriesIds: [timeseriesListV2[0].id],
      contextChart: true,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(wrapper.find('.context-container').exists()).toBeTruthy();
  });
});

it('cursor overview renders with ruler specified', async () => {
  const yLabel = jest.fn();
  const timeLabel = jest.fn();
  const eventMap: { [name: string]: any } = {};
  const timeseriesPoints: { [name: string]: ChartRulerPoint } = {
    [timeseriesListV2[0].id]: {
      id: 1,
      name: 'test',
      value: 100,
      color: '#000',
      timestamp: Date.now(),
      x: 100,
      y: 100,
    },
  };
  window.addEventListener = jest.fn((event: string, cb: any) => {
    eventMap[event] = cb;
  });
  const props = {
    timeseriesIds: [timeseriesListV2[0].id],
    ruler: {
      visible: true,
      yLabel,
      timeLabel,
    },
  };
  const wrapper = mount(
    <ClientSDKProvider client={sdk}>
      <TimeseriesChart {...props} />
    </ClientSDKProvider>
  );
  await sleep(300);
  wrapper.update();

  expect(wrapper.find(CursorOverview).exists()).toBeTruthy();

  wrapper.find(TimeseriesChart).setState({
    rulerPoints: timeseriesPoints,
  });
  wrapper.update();

  eventMap.mousemove({ clientX: 100, clientY: 100 });

  expect(yLabel).toHaveBeenCalled();
  expect(timeLabel).toHaveBeenCalled();
});
