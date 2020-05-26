import { Input } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { assetsList, SearchValue } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { defaultStrings, Search, SearchComponent } from './Search';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onSearch: jest.fn(),
  onAssetSelected: jest.fn(),
  onFilterIconClick: jest.fn(),
  onLiveSearchSelect: jest.fn(),
};

class CogniteClient extends MockCogniteClient {
  assets: any = {
    search: jest.fn(),
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

beforeEach(() => {
  sdk.assets.list.mockResolvedValue({ items: assetsList });
  sdk.assets.search.mockResolvedValue(assetsList);
});

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
});

const createWrapper = (props: any) => {
  return mount(
    <ClientSDKProvider client={sdk}>
      <Search {...props} />
    </ClientSDKProvider>
  );
};

describe('Search', () => {
  it('should renders without exploding', () => {
    const wrapper = mount(<Search />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should get expected default values', () => {
    const wrapper = mount(<Search />).find(SearchComponent);

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
    const wrapper = mount(<Search {...props} />).find(SearchComponent);

    wrapper.find('.anticon.anticon-filter').simulate('click');
    expect(onFilterIconClick).toHaveBeenCalledTimes(1);
    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('should change selected asset ID on user action', done => {
    const { onAssetSelected } = propsCallbacks;
    const props = {
      assets: assetsList,
      rootAssetSelect: true,
      onAssetSelected,
    };
    const wrapper = createWrapper(props);

    setImmediate(() => {
      wrapper.find('.ant-select').simulate('click');
      wrapper
        .find('.ant-select-dropdown-menu-item')
        .last()
        .simulate('click');
      expect(onAssetSelected).toHaveBeenCalledTimes(1);

      done();
    });
  });

  it('should trigger state change while changing input', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<Search {...props} />).find(SearchComponent);
    const instance: SearchComponent = wrapper.instance() as SearchComponent;
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
    const instance: SearchComponent = wrapper
      .find(SearchComponent)
      .instance() as SearchComponent;
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
    expect(wrapper.find(SearchComponent).state()).toMatchObject({
      advancedSearchQuery: null,
      isModalOpen: false,
      query: '',
    });

    searchButton.simulate('click');
    expect(onSearchSubmit).toHaveBeenCalled();
    expect(wrapper.find(SearchComponent).state('isModalOpen')).toEqual(false);
  });

  // We have to check it directly because of debounce wrapper
  it('should call debounceSearch function with right params', () => {
    const { onSearch } = propsCallbacks;
    const props = { onSearch };
    const wrapper = mount(<Search {...props} />).find(SearchComponent);
    const instance = wrapper.instance() as SearchComponent;

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
    const wrapper = mount(<Search {...props} />).find(SearchComponent);
    const instance = wrapper.instance() as SearchComponent;

    instance.onSearchChange(SearchValue);
    expect(wrapper.state('advancedSearchQuery')).toMatchObject(SearchValue);
  });

  it('should change asset value', () => {
    const { onAssetSelected } = propsCallbacks;
    const props = { assets: assetsList, onAssetSelected };
    const wrapper = mount(<Search {...props} />).find(SearchComponent);
    const instance = wrapper.instance() as SearchComponent;
    const assetId = 2;

    instance.onAssetSelected(assetId);
    expect(onAssetSelected).toHaveBeenCalled();
    expect(wrapper.state('assetId')).toEqual(assetId);
  });

  it('should render live search feature', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = {
      showLiveSearchResults: true,
      liveSearchResults: [],
      onLiveSearchSelect,
    };
    const wrapper = mount(<Search {...props} />);

    wrapper.find(SearchComponent).setState({ query: 'test' });
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
    expect(wrapper.find(SearchComponent).state('query')).toEqual(
      assetsList[0].name
    );
  });

  it('should select search result on arrow keys', () => {
    const { onLiveSearchSelect } = propsCallbacks;
    const props = {
      showLiveSearchResults: true,
      liveSearchResults: [],
      onLiveSearchSelect,
    };
    const wrapper = mount(<Search {...props} />);

    wrapper.find(SearchComponent).setState({ query: 'test' });
    wrapper.setProps({ liveSearchResults: assetsList });

    wrapper.update();

    const input = wrapper.find(Input).find('input');

    input
      .simulate('keydown', { keyCode: 40 })
      .simulate('keydown', { keyCode: 40 });
    wrapper.update();

    const list = wrapper.find('ul[data-id="live-search-list"]');

    expect(
      list
        .find('li')
        .at(1)
        .hasClass('active')
    ).toBeTruthy();

    input.simulate('keydown', { keyCode: 13 });
    wrapper.update();

    expect(onLiveSearchSelect).toHaveBeenCalledTimes(1);
    expect(onLiveSearchSelect).toHaveBeenCalledWith(assetsList[1]);
  });
});
