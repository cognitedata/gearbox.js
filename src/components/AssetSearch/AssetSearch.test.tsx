import React from 'react';
import { mount, configure } from 'enzyme';
import AssetSearch from './AssetSearch';
import { assetsList } from 'mocks/assetsList';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('AssetSearch', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<AssetSearch assets={assetsList} />);
    expect(wrapper).toHaveLength(1);
  });
});
