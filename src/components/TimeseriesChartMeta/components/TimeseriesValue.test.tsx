import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapoints, timeseriesListV2 } from '../../../mocks';
import { TimeseriesValue } from './TimeseriesValue';

configure({ adapter: new Adapter() });

sdk.Datapoints.retrieveLatest = jest.fn();

const timeseries = timeseriesListV2[0];
const datapopint = datapoints[0];

beforeEach(() => {
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockResolvedValue(datapopint);
});

afterEach(() => {
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockClear();
});

describe('TimeseriesValue', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
        liveUpdate={false}
      />
    );

    expect(wrapper.find(TimeseriesValue)).toHaveLength(1);
    expect(wrapper.text()).toContain(timeseries.description);
  });

  it('Should  request latest datapoint', () => {
    mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
        liveUpdate={false}
      />
    );

    expect(sdk.Datapoints.retrieveLatest).toBeCalled();
  });

  it('Should retrieve latest datapoint twice if timeseriesName has been changed ', () => {
    const wrapper = mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
        liveUpdate={false}
      />
    );

    wrapper.setProps({ timeseriesName: 'some other timeseries' });

    expect(sdk.Datapoints.retrieveLatest).toBeCalledTimes(2);
  });

  it('Should clear interval after unmounting ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
      />
    );

    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should clear interval after changing timeseriesName ', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
      />
    );
    expect(setInterval).toHaveBeenCalledTimes(1);
    wrapper.setProps({ timeseriesName: 'some name' });
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('Should not call setState on unmounted component', done => {
    TimeseriesValue.prototype.setState = jest.fn();

    const wrapper = mount(
      <TimeseriesValue
        timeseriesName={timeseries.name || ''}
        timeseriesDescription={timeseries.description}
        liveUpdate={false}
      />
    );

    wrapper.unmount();

    setImmediate(() => {
      expect(TimeseriesValue.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
