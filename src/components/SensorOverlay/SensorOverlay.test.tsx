import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SensorOverlay from './SensorOverlay';

configure({ adapter: new Adapter() });

// TODO: add more tests

describe('SensorOverlay', () => {
  it('Renders without exploding', () => {
    const wrapper = shallow(<SensorOverlay />);
    expect(wrapper).toHaveLength(1);
  });
});
