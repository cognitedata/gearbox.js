import * as sdk from '@cognite/sdk';
import { Select } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { assetsList } from '../../../mocks';
import {
  defaultStrings,
  RootAssetSelect,
  RootAssetSelectComponent,
} from './RootAssetSelect';

configure({ adapter: new Adapter() });

const onAssetSelected = jest.fn();

sdk.Assets.list = jest.fn();

beforeEach(() => {
  // @ts-ignore
  sdk.Assets.list.mockResolvedValue({ items: assetsList });
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('RootAssetSelect', () => {
  it('renders without exploding', () => {
    const wrapper = mount(<RootAssetSelect />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('onSelectAsset should be triggered', async done => {
    const wrapper = mount(
      <RootAssetSelectComponent onAssetSelected={onAssetSelected} />
    );
    const instance: RootAssetSelectComponent = wrapper
      .find(RootAssetSelectComponent)
      .instance() as RootAssetSelectComponent;
    const onSelectAsset = jest.spyOn(instance, 'onSelectAsset');
    const assetId = assetsList[0].id;

    wrapper
      .find(Select)
      .find('Select')
      .at(0)
      .simulate('change', { target: { value: assetId } });

    setImmediate(() => {
      instance.forceUpdate();

      expect(onSelectAsset).toHaveBeenCalledWith(assetId);
      expect(onAssetSelected).toHaveBeenCalledWith(assetId);
      expect(wrapper.find(RootAssetSelectComponent).state('current')).toEqual(
        assetId
      );

      done();
    });
  });

  // @ts-ignore
  sdk.Assets.list.mockResolvedValue({ items: [] });

  it('should renders loading state', () => {
    const { loading } = defaultStrings;
    const wrapper = mount(<RootAssetSelect />);
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
