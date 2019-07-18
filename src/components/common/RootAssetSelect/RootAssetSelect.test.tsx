import * as sdk from '@cognite/sdk'; // TODO
import { Select } from 'antd';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { assetsList } from '../../../mocks';
import { defaultStrings, RootAssetSelect } from './RootAssetSelect';

configure({ adapter: new Adapter() });

const onAssetSelected = jest.fn();

sdk.Assets.list = jest.fn(); // TODO

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
    const wrapper = shallow(
      <RootAssetSelect onAssetSelected={onAssetSelected} />
    );
    const instance = wrapper.instance() as RootAssetSelect;
    const onSelectAsset = jest.spyOn(instance, 'onSelectAsset');
    const assetId = assetsList[0].id;

    setImmediate(() => {
      instance.forceUpdate();

      wrapper.find('Select').simulate('change', assetId);

      expect(onSelectAsset).toHaveBeenCalledWith(assetId);
      expect(onAssetSelected).toHaveBeenCalledWith(assetId);
      expect(wrapper.state('current')).toEqual(assetId);

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
