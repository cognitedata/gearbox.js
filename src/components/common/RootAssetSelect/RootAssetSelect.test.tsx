import { CogniteClient } from '@cognite/sdk';
import { Select } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { assetsList } from '../../../mocks';
import { buildMockSdk } from '../../../utils/mockSdk';
import { ClientSDKProvider } from '../../ClientSDKProvider/ClientSDKProvider';
import {
  defaultStrings,
  RootAssetSelect,
  RootAssetSelectComponent,
} from './RootAssetSelect';

configure({ adapter: new Adapter() });

const onAssetSelected = jest.fn();

const mockAssetList = jest.fn().mockResolvedValue({ items: assetsList });

buildMockSdk({
  assets: {
    list: mockAssetList,
  },
});

const sdk = new CogniteClient({ appId: 'gearbox test' });

afterAll(() => {
  jest.clearAllMocks();
});

describe('RootAssetSelect', () => {
  it('renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <RootAssetSelect />
      </ClientSDKProvider>
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('onSelectAsset should be triggered', async () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <RootAssetSelect onAssetSelected={onAssetSelected} />
      </ClientSDKProvider>
    );
    const instance: RootAssetSelectComponent = wrapper
      .find(RootAssetSelectComponent)
      .instance() as RootAssetSelectComponent;
    const onSelectAsset = jest.spyOn(instance, 'onSelectAsset');
    const assetId = assetsList[0].id;

    await instance.componentDidMount();

    wrapper
      .find('.ant-select-arrow')
      .at(0)
      .simulate('click');

    wrapper
      .find('Connect(MenuItem)')
      .at(1)
      .simulate('click');

    const liElement = wrapper.find('.ant-select-dropdown-menu-item-selected');

    expect(onSelectAsset).toHaveBeenCalled();
    expect(onAssetSelected).toHaveBeenCalled();
    expect(liElement.text()).toBe(assetsList[0].description);
    expect(wrapper.find(RootAssetSelectComponent).state('current')).toEqual(
      assetId
    );
  });

  mockAssetList.mockResolvedValue({ items: [] });

  it('should renders loading state', () => {
    const { loading } = defaultStrings;
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <RootAssetSelect />
      </ClientSDKProvider>
    );
    wrapper.find(Select).simulate('click');

    const dropList = wrapper.find('.ant-select-dropdown ul');

    expect(dropList.children().length).toEqual(1);
    expect(
      dropList
        .find('li')
        .at(0)
        .text()
    ).toEqual(loading);
  });
});
