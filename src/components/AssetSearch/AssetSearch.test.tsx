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
  onSearchResult: jest.fn(),
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

sdk.Assets.search = jest.fn();
sdk.Assets.list = jest.fn();

beforeEach(() => {
  // @ts-ignore
  sdk.Assets.list.mockResolvedValue({ items: assetsList });
  // @ts-ignore
  sdk.Assets.search.mockResolvedValue({ items: assetsList });
});

afterEach(() => {
  jest.clearAllMocks();
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
    const showLiveSearchResults = true;
    const props = { onLiveSearchSelect, showLiveSearchResults };
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
  it("should call onSearchResult when it is defined", done => {
    const { onSearchResult } = propsCallbacks;
    const showLiveSearchResults = false;
    const props = { onSearchResult, showLiveSearchResults };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });

    setImmediate(() => {
      wrapper.update();
      expect(onSearchResult).toHaveBeenCalled();
      done();
    });
  });
  it('should call onSearchResult with empty array in parameter when input is an empty string', done => {
    const { onSearchResult } = propsCallbacks;
    const showLiveSearchResults = false;
    const props = { onSearchResult, showLiveSearchResults };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: '' } });

    setImmediate(() => {
      wrapper.update();
      expect(Array.isArray(onSearchResult.mock.calls[0][0])).toBeTruthy();
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

  it('should fetch root assets when rootAssetSelect is true', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: true };
    const wrapper = mount(<AssetSearch {...props} />);

    setImmediate(() => {
      wrapper.update();
      expect(sdk.Assets.list).toHaveBeenCalled();
      done();
    });
  });

  it('should not fetch root assets when rootAssetSelect is false', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: false };
    const wrapper = mount(<AssetSearch {...props} />);

    setImmediate(() => {
      wrapper.update();
      expect(sdk.Assets.list).not.toHaveBeenCalled();
      done();
    });
  });

  it('should fetch root assets when rootAssetSelect changes from false to true', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: false };
    const wrapper = mount(<AssetSearch {...props} />);

    setImmediate(() => {
      wrapper.update();
      wrapper.setProps({ rootAssetSelect: true });
      // tslint:disable-next-line: no-identical-functions
      setImmediate(() => {
        wrapper.update();
        expect(sdk.Assets.list).toHaveBeenCalled();
        done();
      });
    });
  });
});
