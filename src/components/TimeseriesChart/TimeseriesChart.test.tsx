import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { datapointsList, sleep, timeseriesListV2 } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { TimeseriesChart } from './TimeseriesChart';

configure({ adapter: new Adapter() });

const mockedClient: API = {
  // @ts-ignore
  timeseries: {
    retrieve: jest.fn(),
  },
  // @ts-ignore
  datapoints: {
    retrieve: jest.fn(),
  },
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  // @ts-ignore
  mockedClient.timeseries.retrieve.mockResolvedValue([timeseriesListV2[0]]);
  // @ts-ignore
  mockedClient.datapoints.retrieve.mockResolvedValue([datapointsList]);
});

afterEach(() => {
  jest.clearAllMocks();
});

// tslint:disable:no-big-function
describe('TimeseriesChart', () => {
  it('calls the sdk', async () => {
    const id = 123;
    const props = {
      timeseriesIds: [id],
    };
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(mockedClient.timeseries.retrieve).toHaveBeenCalledTimes(1);
    expect(mockedClient.timeseries.retrieve).toHaveBeenCalledWith([{ id }]);
    expect(mockedClient.datapoints.retrieve).toHaveBeenCalledTimes(1);
    expect(mockedClient.datapoints.retrieve).toHaveBeenCalledWith({
      items: [expect.objectContaining({ id })],
    });
  });

  it('renders correctly when ids are specified', async () => {
    const props = {
      timeseriesIds: [timeseriesListV2[0].id],
    };
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
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
      <ClientSDKProvider client={mockedClient}>
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
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(wrapper.find('.context-container').exists()).toBeTruthy();
  });
});
