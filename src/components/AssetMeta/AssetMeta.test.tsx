import * as sdk from '@cognite/sdk';
import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { DOCUMENTS, fakeAsset, fakeEvents, timeseriesList } from '../../mocks';
import { AssetMeta } from './AssetMeta';

const fakeClient: API = {
  // @ts-ignore
  assets: {
    retrieve: jest.fn(),
  },
  // @ts-ignore
  events: {
    list: jest.fn(),
  },
};

// @ts-ignore
sdk.Files.list = jest.fn();
// @ts-ignore
sdk.TimeSeries.list = jest.fn();

configure({ adapter: new Adapter() });

beforeEach(() => {
  // @ts-ignore
  fakeClient.assets.retrieve.mockResolvedValue([fakeAsset]);
  // @ts-ignore
  fakeClient.events.list.mockReturnValue({
    autoPagingToArray: () => Promise.resolve(fakeEvents),
  });
  // @ts-ignore
  sdk.Files.list.mockResolvedValue({ items: DOCUMENTS });
  // @ts-ignore
  sdk.TimeSeries.list.mockResolvedValue({ items: timeseriesList });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetMeta', () => {
  it('should render without exploding', done => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <AssetMeta assetId={123} />
      </ClientSDKProvider>
    );
    expect(wrapper.exists()).toBe(true);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(AssetMeta)).toHaveLength(1);
      expect(wrapper.find('h3')).toHaveLength(1);
      expect(wrapper.find('h3 + p')).toHaveLength(1);
      expect(wrapper.find('TabBar')).toHaveLength(1);
      expect(wrapper.find('div.ant-tabs-tab')).toHaveLength(4);
      expect(wrapper.find('TabPane')).toHaveLength(4);
      done();
    });
  });

  it('should render "no asset" if assetId was not passed', () => {
    // @ts-ignore
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        // @ts-ignore
        <AssetMeta />
      </ClientSDKProvider>
    );
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(AssetMeta)).toHaveLength(1);
    expect(wrapper.find('p')).toHaveLength(1);
    expect(wrapper.find('p').text()).toEqual('no Asset');
  });

  it('should fetch asset, events and documents if assetId was passed after creation', done => {
    // @ts-ignore
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        // @ts-ignore
        <AssetMeta />
      </ClientSDKProvider>
    );
    wrapper.setProps(
      {
        children: <AssetMeta assetId={123} />,
      },
      () => {
        setImmediate(() => {
          wrapper.update();
          expect(wrapper.find(AssetMeta)).toHaveLength(1);
          expect(wrapper.find('h3').text()).toEqual(fakeAsset.name);
          expect(wrapper.find('h3 + p').text()).toEqual(fakeAsset.description);
          done();
        });
      }
    );
  });

  it('should render spinner while loading asset, events and documents', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <AssetMeta assetId={123} />
      </ClientSDKProvider>
    );
    expect(wrapper.find('Spin')).toHaveLength(1);
    expect(wrapper.find('div.ant-spin.ant-spin-spinning')).toHaveLength(1);
  });

  it('should trigger callback on pane change', done => {
    const onPaneChange = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <AssetMeta assetId={123} onPaneChange={onPaneChange} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      wrapper.update();
      const tabs = wrapper.find('div.ant-tabs-tab');
      tabs.at(1).simulate('click');
      expect(onPaneChange).toBeCalledWith('timeseries');
      tabs.at(2).simulate('click');
      expect(onPaneChange).toBeCalledWith('documents');
      tabs.at(3).simulate('click');
      expect(onPaneChange).toBeCalledWith('events');
      tabs.at(0).simulate('click');
      expect(onPaneChange).toBeCalledWith('details');
      done();
    });
  });
});
