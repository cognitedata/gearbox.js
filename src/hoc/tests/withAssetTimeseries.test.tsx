import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesList } from '../../mocks';
import {
  withAssetTimeseries,
  WithAssetTimeseriesDataProps,
} from '../withAssetTimeseries';

configure({ adapter: new Adapter() });

sdk.TimeSeries.list = jest.fn();

describe('withAssetTimeseries', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.TimeSeries.list.mockResolvedValue({ items: timeseriesList });
  });

  afterEach(() => {
    // @ts-ignore
    sdk.TimeSeries.list.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(
      <WrappedComponent
        assetId={123}
        customSpinner={<div className="my-custom-spinner" />}
      />
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const loadHandler = jest.fn();
    mount(
      <WrappedComponent assetId={123} onAssetTimeseriesLoaded={loadHandler} />
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
    const wrapper = mount(<WrappedComponent assetId={123} />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.ts-number').text()).toEqual(
        timeseriesList.length.toString()
      );
      expect(wrapper.find('p.first-ts-description').text()).toEqual(
        timeseriesList[0].description
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.setProps({ assetId: 1234 });

    setImmediate(() => {
      expect(sdk.TimeSeries.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetTimeseries(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
