import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { datapointsList, sleep, timeseriesListV2 } from '../../mocks';

import { ClientSDKProvider } from '../ClientSDKProvider';
import { TimeseriesChart } from './TimeseriesChart';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  timeseries: {
    retrieve: jest.fn(),
  },
  // @ts-ignore
  datapoints: {
    retrieve: jest.fn(),
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  // @ts-ignore
  fakeClient.timeseries.retrieve.mockResolvedValue([timeseriesListV2[0]]);
  // @ts-ignore
  fakeClient.datapoints.retrieve.mockResolvedValue([datapointsList]);
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
      <ClientSDKProvider client={sdk}>
        <TimeseriesChart {...props} />
      </ClientSDKProvider>
    );
    await sleep(300);
    wrapper.update();
    expect(fakeClient.timeseries.retrieve).toHaveBeenCalledTimes(1);
    expect(fakeClient.timeseries.retrieve).toHaveBeenCalledWith([{ id }]);
    expect(fakeClient.datapoints.retrieve).toHaveBeenCalledTimes(1);
    expect(fakeClient.datapoints.retrieve).toHaveBeenCalledWith({
      items: [expect.objectContaining({ id })],
    });
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
