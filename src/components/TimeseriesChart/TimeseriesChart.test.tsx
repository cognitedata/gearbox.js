import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { datapointsList, sleep, timeseriesListV2 } from '../../mocks';
import { MockCogniteClient } from '../../utils/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
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
    expect(sdk.timeseries.retrieve).toHaveBeenCalledTimes(1);
    expect(sdk.timeseries.retrieve).toHaveBeenCalledWith([{ id }]);
    expect(sdk.datapoints.retrieve).toHaveBeenCalledTimes(1);
    expect(sdk.datapoints.retrieve).toHaveBeenCalledWith({
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
