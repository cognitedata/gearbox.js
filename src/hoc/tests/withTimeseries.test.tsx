import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { timeseriesListV2 } from '../../mocks';
import { withTimeseries, WithTimeseriesDataProps } from '../withTimeseries';

configure({ adapter: new Adapter() });

const timeseries = timeseriesListV2[0];

const mockedClient: API = {
  // @ts-ignore
  timeseries: {
    retrieve: jest.fn(),
  },
};

describe('withTimeresries', () => {
  beforeEach(() => {
    // @ts-ignore
    mockedClient.timeseries.retrieve.mockResolvedValue([timeseries]);
  });

  afterEach(() => {
    // @ts-ignore
    jest.clearAllMocks();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent timeseriesId={123} />
      </ClientSDKProvider>
    );

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent
          timeseriesId={123}
          customSpinner={<div className="my-custom-spinner" />}
        />
      </ClientSDKProvider>
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Wrapped component should receive timeseries data after loading', done => {
    const TestComponent: React.SFC<WithTimeseriesDataProps> = props => (
      <div>
        <p className="name">{props.timeseries.name}</p>
        <p className="description">{props.timeseries.description}</p>
      </div>
    );
    const WrappedComponent = withTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent timeseriesId={123} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.name').text()).toEqual(timeseries.name);
      expect(wrapper.find('p.description').text()).toEqual(
        timeseries.description
      );
      done();
    });
  });

  it('Should request for timeseries if timeseriesId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withTimeseries(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent timeseriesId={123} />
      </ClientSDKProvider>
    );

    wrapper.setProps({
      children: <WrappedComponent timeseriesId={1234} />,
    });

    setImmediate(() => {
      expect(mockedClient.timeseries.retrieve).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withTimeseries(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={mockedClient}>
        <WrappedComponent timeseriesId={123} />
      </ClientSDKProvider>
    );

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
