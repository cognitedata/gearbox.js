import { mount, configure } from 'enzyme';
import AssetSearchForm from './AssetSearchForm';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('AssetSearchForm', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<AssetSearchForm value={null} />);
    expect(wrapper).toHaveLength(1);
  });
});
