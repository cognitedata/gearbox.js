import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Search, defaultStrings } from './Search';
import { assetsList, SearchValue } from '../../../mocks';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onSearch: jest.fn(),
  onAssetSelected: jest.fn(),
  onFilterIconClick: jest.fn(),
  onLiveSearchSelect: jest.fn(),
};

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
});

describe('Search', () => {
  it('should renders without exploding', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<Search {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should get expected default values', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<Search {...props} />);

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

  it('should trigger filter icon callback on modal opening', () => {
    const { onFilterIconClick } = propsCallbacks;
    const props = {
      assets: assetsList,
      advancedSearch: true,
      onFilterIconClick,
    };
    const wrapper = mount(<Search {...props} />);

    wrapper.find('.anticon.anticon-filter').simulate('click');
    expect(onFilterIconClick).toHaveBeenCalledTimes(1);
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('should change selected asset ID on user action', () => {
    const { onAssetSelected } = propsCallbacks;
    const props = {
      assets: assetsList,
      rootAssetSelect: true,
      onAssetSelected,
    };
    const wrapper = mount(<Search {...props} />);

    wrapper.find('.ant-select').simulate('click');
    wrapper
      .find('.ant-select-dropdown-menu-item')
      .last()
      .simulate('click');
    expect(onAssetSelected).toHaveBeenCalledTimes(1);
  });

  it('should trigger state change while changing input', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<Search {...props} />);
    const instance: Search = wrapper.instance() as Search;
    const onSearchQueryInput = jest.spyOn(instance, 'onSearchQueryInput');
    const input = 'test';

    // related to enzyme issue with class properties definition
    // https://github.com/airbnb/enzyme/issues/944
    instance.forceUpdate();

    wrapper.find('input').simulate('change', { target: { value: input } });
    expect(onSearchQueryInput).toHaveBeenCalledTimes(1);
    expect(wrapper.state('query')).toEqual(input);
  });

  it('should trigger modal callback on user actions', () => {
    const props = { assets: assetsList, advancedSearch: true };
    const wrapper = mount(<Search {...props} />);
    const instance = wrapper.instance() as Search;
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
  it('should call debounceSearch function with right params', () => {
    const { onSearch } = propsCallbacks;
    const props = { onSearch };
    const wrapper = mount(<Search {...props} />);
    const instance: Search = wrapper.instance() as Search;

    wrapper.setState({ assetId: 1, query: 'test' });
    instance.debouncedSearch();

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith({
      advancedSearch: null,
      assetSubtrees: [1],
      fetchingLimit: 25,
      query: 'test',
    });
  });

  it('should change onSearchChange state value', () => {
    const props = { assets: assetsList };
    const wrapper = mount(<Search {...props} />);
    const instance = wrapper.instance() as Search;

    instance.onSearchChange(SearchValue);
    expect(wrapper.state('advancedSearchQuery')).toMatchObject(SearchValue);
  });

  it('should change asset value', () => {
    const { onAssetSelected } = propsCallbacks;
    const props = { assets: assetsList, onAssetSelected };
    const wrapper = mount(<Search {...props} />);
    const instance = wrapper.instance() as Search;
    const assetId = 2;

    instance.onAssetSelected(assetId);
    expect(onAssetSelected).toHaveBeenCalled();
    expect(wrapper.state('assetId')).toEqual(assetId);
  });

  it('should render live search feature', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = {
      liveSearch: true,
      liveSearchResults: [],
      onLiveSearchSelect,
    };
    const wrapper = mount(<Search {...props} />);

    wrapper.setState({ query: 'test' });
    wrapper.setProps({ liveSearchResults: assetsList });

    wrapper.update();

    const list = wrapper.find('ul[data-id="live-search-list"]');

    expect(list).toHaveLength(1);
    expect(list.find('li')).toHaveLength(assetsList.length);

    list
      .find('li')
      .first()
      .simulate('mousedown');

    expect(onLiveSearchSelect).toHaveBeenCalledTimes(1);
    expect(wrapper.state('query')).toEqual(assetsList[0].name);
  });
});
