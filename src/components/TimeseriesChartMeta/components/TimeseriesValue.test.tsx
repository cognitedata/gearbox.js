import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapoints, timeseriesListV2 } from '../../../mocks';
// import { buildMockSdk } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { TimeseriesValue } from './TimeseriesValue';

configure({ adapter: new Adapter() });

const timeseries = timeseriesListV2[0];
const datapoint = datapoints[0];

const fakeClient: CogniteClient = {
  // @ts-ignore
  datapoints: {
    retrieveLatest: jest.fn(),
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

beforeEach(() => {
  // @ts-ignore
  fakeClient.datapoints.retrieveLatest.mockResolvedValue([
    { datapoints: [datapoint] },
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesValue', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
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
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
          timeseriesDescription={timeseries.description}
          liveUpdate={false}
        />
      </ClientSDKProvider>
    );

    expect(fakeClient.datapoints.retrieveLatest).toBeCalled();
  });

  it('Should retrieve latest datapoint twice if timeseriesId has been changed ', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
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
          timeseriesId={1234}
        />
      ),
    });

    expect(fakeClient.datapoints.retrieveLatest).toBeCalledTimes(2);
  });

  it('Should clear interval after unmounting ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
          timeseriesDescription={timeseries.description}
        />
      </ClientSDKProvider>
    );

    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should clear interval after changing timeseriesId ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
          timeseriesDescription={timeseries.description}
        />
      </ClientSDKProvider>
    );
    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.setProps({
      children: (
        <TimeseriesValue
          timeseriesDescription={timeseries.description}
          timeseriesId={1234}
        />
      ),
    });
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should not call setState on unmounted component', done => {
    TimeseriesValue.prototype.setState = jest.fn();

    console.log(sdk.datapoints);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesValue
          timeseriesId={timeseries.id}
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
