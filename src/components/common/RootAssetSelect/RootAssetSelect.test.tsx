import React from 'react';
import { mount, configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { assetsList } from '../../../mocks';
import { RootAssetSelect, defaultStrings } from './RootAssetSelect';

configure({ adapter: new Adapter() });

const onAssetSelected = jest.fn();

describe('EventPreview', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<RootAssetSelect assets={assetsList} />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('Loading assets', () => {
    const { loading } = defaultStrings;
    const wrapper = mount(<RootAssetSelect assets={[]} />);

    wrapper.simulate('click');

    const dropList = wrapper.find('.ant-select-dropdown ul');

    expect(dropList.children().length).toEqual(1);
    expect(
      dropList
        .find('li')
        .at(0)
        .text()
    ).toEqual(loading);
  });

  it('Check AssetSelected callback', () => {
    const wrapper = shallow(
      <RootAssetSelect assets={assetsList} onAssetSelected={onAssetSelected} />
    );
    const instance = wrapper.instance() as RootAssetSelect;
    const onSelectAsset = jest.spyOn(instance, 'onSelectAsset');
    const assetId = assetsList[0].id;

    instance.forceUpdate();

    wrapper.find('Select').simulate('change', assetId);

    expect(onSelectAsset).toHaveBeenCalledWith(assetId);
    expect(onAssetSelected).toHaveBeenCalledWith(assetId);
    expect(wrapper.state('current')).toEqual(assetId);
  });
});
