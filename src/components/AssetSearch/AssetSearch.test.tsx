import * as sdk from '@cognite/sdk';
import { Input } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { assetsList } from '../../mocks';
import { AssetSearch } from './AssetSearch';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onError: jest.fn(),
  onLiveSearchSelect: jest.fn(),
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

sdk.Assets.search = jest.fn();
beforeEach(() => {
  // @ts-ignore
  sdk.Assets.search.mockResolvedValue({ items: assetsList });
});

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
  // @ts-ignore
  sdk.Assets.search.mockClear();
});

describe('AssetSearch', () => {
  it('should renders without exploding', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect };
    const wrapper = mount(<AssetSearch {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should search when input changes', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });

    setImmediate(() => {
      wrapper.update();
      // @ts-ignore
      wrapper
        .find('li')
        .first()
        .props()
        .onMouseDown();
      expect(onLiveSearchSelect).toHaveBeenCalled();
      done();
    });
  });

  it('should call onError when error', done => {
    // @ts-ignore
    sdk.Assets.search.mockRejectedValue(new Error('error'));

    const { onLiveSearchSelect, onError } = propsCallbacks;
    const props = { onLiveSearchSelect, onError };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });
    setImmediate(() => {
      wrapper.update();
      expect(onError).toHaveBeenCalled();
      done();
    });
  });
});
