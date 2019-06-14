import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapoints, timeseriesListV2 } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesValue } from './TimeseriesValue';

configure({ adapter: new Adapter() });

const timeseries = timeseriesListV2[0];
const datapoint = datapoints[0];

const mockedClient: API = {
  // @ts-ignore
  datapoints: {
    retrieveLatest: jest.fn(),
  },
};

beforeEach(() => {
  // @ts-ignore
  mockedClient.datapoints.retrieveLatest.mockResolvedValue([
    { datapoints: [datapoint] },
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesValue', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
        />
      </ClientSDKProvider>
    );

    expect(wrapper.find(TimeseriesValue)).toHaveLength(1);
    expect(wrapper.text()).toContain(timeseries.description);
  });

  it('Should  request latest datapoint', () => {
    mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
        />
      </ClientSDKProvider>
    );

    expect(mockedClient.datapoints.retrieveLatest).toBeCalled();
  });

  it('Should retrieve latest datapoint twice if timeseriesName has been changed ', () => {
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
        />
      </ClientSDKProvider>
    );

    wrapper.setProps({
      children: (
        <TimeseriesValue
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
          timeseriesName={'some other timeseries'}
        />
      ),
    });

    expect(mockedClient.datapoints.retrieveLatest).toBeCalledTimes(2);
  });

  it('Should clear interval after unmounting ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
        />
      </ClientSDKProvider>
    );

    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should clear interval after changing timeseriesName ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
        />
      </ClientSDKProvider>
    );
    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.setProps({
      children: (
        <TimeseriesValue
          timeseriesDescription={timeseries.description}
          timeseriesName={'some other timeseries'}
        />
      ),
    });
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should not call setState on unmounted component', done => {
    TimeseriesValue.prototype.setState = jest.fn();

    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <TimeseriesValue
          timeseriesName={timeseries.name || ''}
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
        />
      </ClientSDKProvider>
    );

    wrapper.unmount();

    setImmediate(() => {
      expect(TimeseriesValue.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
