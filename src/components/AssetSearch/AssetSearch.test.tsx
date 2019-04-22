import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AssetSearch } from './AssetSearch';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onError: jest.fn(),
  onLiveSearchSelect: jest.fn(),
};

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
});

describe('AssetSearch', () => {
  it('should renders without exploding', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect };
    const wrapper = mount(<AssetSearch {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
});
