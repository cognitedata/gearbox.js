import React from 'react';
import { mount, configure } from 'enzyme';
import * as sdk from '@cognite/sdk';
import Adapter from 'enzyme-adapter-react-16';
import TimeseriesChart from 'components/TimeseriesChart/TimeseriesChart';

const ApiKey = 'ZTg3NzA4ZmMtNWExYS00OWMzLWExZmItZmRiNGFlOTc0MGM3';

sdk.configure({
  apiKey: ApiKey,
  project: 'publicdata',
});

configure({ adapter: new Adapter() });

// tslint:disable:no-big-function
describe('TimeseriesChart', () => {
  it('Renders without exploding', () => {
    const props = {};
    const wrapper = mount(<TimeseriesChart {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
});
