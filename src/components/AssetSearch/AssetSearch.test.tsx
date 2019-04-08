import React from 'react';
import { mount, configure } from 'enzyme';
import AssetSearch, { defaultStrings } from './AssetSearch';
import { assetsList, AssetSearchFormValue } from 'mocks/assetsList';
import Adapter from 'enzyme-adapter-react-16';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onSearchResults: jest.fn(),
  onSearch: jest.fn(),
  onAssetSelected: jest.fn(),
  onFilterIconClick: jest.fn(),
};

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
});

describe('AssetSearch', () => {
  it('Renders without exploding', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<AssetSearch {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Check default values', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<AssetSearch {...props} />);

    expect(wrapper.prop('fetchingLimit')).toEqual(25);
    expect(wrapper.prop('debounceTime')).toEqual(200);
    expect(wrapper.prop('strings')).toMatchObject({});
    expect(wrapper.prop('advancedSearch')).toEqual(false);
    expect(wrapper.prop('rootAssetSelect')).toEqual(false);
    expect(wrapper.state('assetId')).toEqual(0);
    expect(wrapper.state('query')).toEqual('');
    expect(wrapper.state('isModalOpen')).toEqual(false);
    expect(wrapper.state('advancedSearchQuery')).toEqual(null);
  });

  it('On filter icon click', () => {
    const { onFilterIconClick } = propsCallbacks;
    const props = {
      assets: assetsList,
      advancedSearch: true,
      onFilterIconClick,
    };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper.find('.anticon.anticon-filter').simulate('click');
    expect(onFilterIconClick).toHaveBeenCalledTimes(1);
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('On root asset select', () => {
    const { onAssetSelected } = propsCallbacks;
    const props = {
      assets: assetsList,
      rootAssetSelect: true,
      onAssetSelected,
    };
    const wrapper = mount(<AssetSearch {...props} />);

    wrapper.find('.ant-select').simulate('click');
    wrapper
      .find('.ant-select-dropdown-menu-item')
      .last()
      .simulate('click');
    expect(onAssetSelected).toHaveBeenCalledTimes(1);
  });

  it('Check input field change', () => {
    const { onSearch, onSearchResults } = propsCallbacks;
    const props = { assets: assetsList, onSearch, onSearchResults };
    const wrapper = mount(<AssetSearch {...props} />);
    const instance: AssetSearch = wrapper.instance() as AssetSearch;
    const onSearchQueryInput = jest.spyOn(instance, 'onSearchQueryInput');
    const input = 'test';

    // related to enzyme issue with class properties definition
    // https://github.com/airbnb/enzyme/issues/944
    instance.forceUpdate();

    wrapper.find('input').simulate('change', { target: { value: input } });
    expect(onSearchQueryInput).toHaveBeenCalledTimes(1);
    expect(wrapper.state('query')).toEqual(input);
  });

  it('Check on modal callbacks', () => {
    const { onSearchResults } = propsCallbacks;
    const props = { assets: assetsList, onSearchResults, advancedSearch: true };
    const wrapper = mount(<AssetSearch {...props} />);
    const instance = wrapper.instance() as AssetSearch;
    const onSearchClear = jest.spyOn(instance, 'onModalCancel');
    const onSearchSubmit = jest.spyOn(instance, 'onModalOk');

    wrapper.find('.anticon.anticon-filter').simulate('click');

    const clearButton = wrapper.findWhere(
      n => n.text() === defaultStrings.clear && n.type() === 'button'
    );
    const searchButton = wrapper.findWhere(
      n => n.text() === defaultStrings.search && n.type() === 'button'
    );

    instance.forceUpdate();

    clearButton.simulate('click');

    expect(onSearchClear).toHaveBeenCalled();
    expect(onSearchResults).toHaveBeenCalled();
    expect(wrapper.state()).toMatchObject({
      advancedSearchQuery: null,
      isModalOpen: false,
      query: '',
    });

    searchButton.simulate('click');
    expect(onSearchSubmit).toHaveBeenCalled();
    expect(wrapper.state('isModalOpen')).toEqual(false);
  });

  // We have to check it directly because of debounce wrapper
  it('Check debounced search function', () => {
    const { onSearch, onSearchResults } = propsCallbacks;
    const props = { assets: assetsList, onSearch, onSearchResults };
    const wrapper = mount(<AssetSearch {...props} />);
    const instance: AssetSearch = wrapper.instance() as AssetSearch;

    instance.debouncedSearch();

    expect(onSearchResults).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledTimes(0);

    wrapper.setState({ assetId: 1, query: 'test' });
    instance.debouncedSearch();

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith({
      advancedSearch: null,
      assetSubtrees: [1],
      boostName: true,
      fetchingLimit: 25,
      query: 'test',
    });
  });

  it('Check onAssetSearchChange function', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<AssetSearch {...props} />);
    const instance = wrapper.instance() as AssetSearch;

    instance.onAssetSearchChange(AssetSearchFormValue);
    expect(wrapper.state('advancedSearchQuery')).toMatchObject(
      AssetSearchFormValue
    );
  });

  it('Check asset value change', () => {
    const { onAssetSelected } = propsCallbacks;
    const props = { assets: assetsList, onAssetSelected };
    const wrapper = mount(<AssetSearch {...props} />);
    const instance = wrapper.instance() as AssetSearch;
    const assetId = 'na-1';

    instance.onAssetSelected(assetId);
    expect(onAssetSelected).toHaveBeenCalled();
    expect(wrapper.state('assetId')).toEqual(assetId);
  });
});
