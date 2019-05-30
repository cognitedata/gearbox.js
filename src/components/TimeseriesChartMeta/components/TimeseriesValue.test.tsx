import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapoints, timeseriesList } from '../../../mocks';
import { TimeseriesValue } from './TimeseriesValue';

configure({ adapter: new Adapter() });

sdk.Datapoints.retrieveLatest = jest.fn();

const timeseries = timeseriesList[0] as sdk.Timeseries;
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
        timeseriesName={timeseries.name}
        timeseriesDescription={timeseries.description}
        liveUpdate={false}
      />
    );

    expect(wrapper.find(TimeseriesValue)).toHaveLength(1);
    expect(wrapper.text()).toContain(timeseries.description);
  });
});
