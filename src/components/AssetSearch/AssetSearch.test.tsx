import { CogniteClient } from '@cognite/sdk';
import { Input } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { assetsList } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
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

const fakeClient: CogniteClient = {
  // @ts-ignore
  assets: {
    search: jest.fn(),
    list: jest.fn(),
  },
};

beforeEach(() => {
  // @ts-ignore
  fakeClient.assets.list.mockResolvedValue(assetsList);
  // @ts-ignore
  fakeClient.assets.search.mockResolvedValue(assetsList);
});

const createWrapper = (props: any) => {
  return mount(
    <ClientSDKProvider client={fakeClient}>
      <AssetSearch {...props} />
    </ClientSDKProvider>
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetSearch', () => {
  it('should renders without exploding', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect };
    const wrapper = createWrapper(props);
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
  it('should call onSearchResult when it is defined', done => {
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
      expect(onSearchResult.mock.calls[0][0].length).toBe(0);
      done();
    });
  });

  it('should call onError when error', done => {
    // @ts-ignore
    fakeClient.assets.search.mockRejectedValue(new Error('error'));

    const { onLiveSearchSelect, onError } = propsCallbacks;
    const props = { onLiveSearchSelect, onError };
    const wrapper = createWrapper(props);

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

  // TODO disabled due to rootAssetSelect changes in SDK 2.0
  xit('should fetch root assets when rootAssetSelect is true', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: true };
    const wrapper = createWrapper(props);

    setImmediate(() => {
      wrapper.update();
      expect(fakeClient.assets.list).toHaveBeenCalled();
      done();
    });
  });

  xit('should not fetch root assets when rootAssetSelect is false', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: false };
    const wrapper = createWrapper(props);

    setImmediate(() => {
      wrapper.update();
      expect(fakeClient.assets.list).not.toHaveBeenCalled();
      done();
    });
  });

  xit('should fetch root assets when rootAssetSelect changes from false to true', done => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = { onLiveSearchSelect, rootAssetSelect: false };
    const wrapper = createWrapper(props);

    setImmediate(() => {
      wrapper.update();
      wrapper.setProps({ rootAssetSelect: true });
      // tslint:disable-next-line: no-identical-functions
      setImmediate(() => {
        wrapper.update();
        expect(fakeClient.assets.list).toHaveBeenCalled();
        done();
      });
    });
  });
});
