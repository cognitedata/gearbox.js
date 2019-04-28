import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { getAssetEvent, getAssetFiles, retrieveAsset } from '../../api';
import { ASSET_DATA, DOCUMENTS, EVENTS } from '../../mocks';
import { AssetMeta } from './AssetMeta';

// @ts-ignore
retrieveAsset = jest.fn();
// @ts-ignore
getAssetEvent = jest.fn();
// @ts-ignore
getAssetFiles = jest.fn();

configure({ adapter: new Adapter() });

beforeEach(() => {
  // @ts-ignore
  retrieveAsset.mockImplementation(
    async (): Promise<sdk.Asset> => {
      return ASSET_DATA;
    }
  );
  // @ts-ignore
  getAssetEvent.mockImplementation(
    async (): Promise<sdk.Event[]> => {
      return EVENTS;
    }
  );
  // @ts-ignore
  getAssetFiles.mockImplementation(
    async (): Promise<sdk.File[]> => {
      return DOCUMENTS;
    }
  );
});

describe('AssetMeta', () => {
  it('should render without exploding', done => {
    const wrapper = mount(<AssetMeta assetId={123} />);
    expect(wrapper.exists()).toBe(true);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(AssetMeta)).toHaveLength(1);
      expect(wrapper.find('h3')).toHaveLength(1);
      expect(wrapper.find('h3 + p')).toHaveLength(1);
      expect(wrapper.find('TabBar')).toHaveLength(1);
      expect(wrapper.find('div.ant-tabs-tab')).toHaveLength(3);
      expect(wrapper.find('TabPane')).toHaveLength(3);
      done();
    });
  });

  it('should render "no asset" if assetId was not passed', () => {
    // @ts-ignore
    const wrapper = mount(<AssetMeta />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(AssetMeta)).toHaveLength(1);
    expect(wrapper.find('p')).toHaveLength(1);
    expect(wrapper.find('p').text()).toEqual('no Asset');
  });

  it('should fetch asset, events and documents if assetId was passed after creation', done => {
    // @ts-ignore
    const wrapper = mount(<AssetMeta />);
    wrapper.setProps({ assetId: 123 }, () => {
      setImmediate(() => {
        wrapper.update();
        expect(wrapper.find(AssetMeta)).toHaveLength(1);
        expect(wrapper.find('h3').text()).toEqual(ASSET_DATA.name);
        expect(wrapper.find('h3 + p').text()).toEqual(ASSET_DATA.description);
        done();
      });
    });
  });

  it('should render spinner while loading asset, events and documents', () => {
    // @ts-ignore
    retrieveAsset.mockImplementation(
      (): Promise<sdk.Asset> => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(ASSET_DATA);
          }, 10000);
        });
      }
    );

    const wrapper = mount(<AssetMeta assetId={123} />);
    expect(wrapper.find('Spin')).toHaveLength(1);
    expect(wrapper.find('div.ant-spin.ant-spin-spinning')).toHaveLength(1);
  });

  it('should trigger callback on pane change', done => {
    const onPaneChange = jest.fn();
    const wrapper = mount(
      <AssetMeta assetId={123} onPaneChange={onPaneChange} />
    );
    setImmediate(() => {
      wrapper.update();
      const tabs = wrapper.find('div.ant-tabs-tab');
      tabs.at(1).simulate('click');
      expect(onPaneChange).toBeCalledWith('documents');
      tabs.at(2).simulate('click');
      expect(onPaneChange).toBeCalledWith('events');
      tabs.at(0).simulate('click');
      expect(onPaneChange).toBeCalledWith('details');
      done();
    });
  });
});
