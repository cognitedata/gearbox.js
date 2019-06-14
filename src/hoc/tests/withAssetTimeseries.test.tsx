import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { SDK_LIST_LIMIT } from '../../constants/sdk';
import { timeseriesListV2 } from '../../mocks';
import {
  withAssetTimeseries,
  WithAssetTimeseriesDataProps,
} from '../withAssetTimeseries';

configure({ adapter: new Adapter() });

const mockedClient: API = {
  // @ts-ignore
  timeseries: {
    list: jest.fn(),
  },
};

describe('withAssetTimeseries', () => {
  beforeEach(() => {
    // @ts-ignore
    mockedClient.timeseries.list.mockReturnValue({
      autoPagingToArray: async () => [timeseriesListV2],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent
          assetId={123}
          customSpinner={<div className="my-custom-spinner" />}
        />
      </ClientSDKProvider>
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const loadHandler = jest.fn();
    mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} onAssetTimeseriesLoaded={loadHandler} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      expect(loadHandler).toBeCalled();
      done();
    });
  });

  it('Wrapped component should receive asset events  after loading', done => {
    const TestComponent: React.SFC<WithAssetTimeseriesDataProps> = props => (
      <div>
        <p className="ts-number">{props.assetTimeseries.length}</p>
        <p className="first-ts-description">
          {props.assetTimeseries[0].description}
        </p>
      </div>
    );
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.ts-number').text()).toEqual(
        timeseriesListV2.length.toString()
      );
      expect(wrapper.find('p.first-ts-description').text()).toEqual(
        timeseriesListV2[0].description
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.setProps({ children: <WrappedComponent assetId={1234} /> });

    setImmediate(() => {
      expect(mockedClient.timeseries.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });

  it('Should merge query params with assetId', () => {
    const WrappedComponent = withAssetTimeseries(() => <div />);
    mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent
          assetId={123}
          queryParams={{ assetIds: [34234], limit: 78 }}
        />
      </ClientSDKProvider>
    );

    expect(mockedClient.timeseries.list).toBeCalledWith({
      assetIds: [123],
      limit: 78,
    });
  });

  it('Should call sdk.TimeSeries.list with default limit', () => {
    const WrappedComponent = withAssetTimeseries(() => <div />);
    mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(mockedClient.timeseries.list).toBeCalledWith({
      assetIds: [123],
      limit: SDK_LIST_LIMIT,
    });
  });
});
