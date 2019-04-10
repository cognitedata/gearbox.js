// tslint:disable
import React from 'react';
import { mount, configure } from 'enzyme';
import { Input } from 'antd';
import lodash from 'lodash';
import TimeserieSearchAndSelect from './TimeseriesSearchAndSelect';
import DetailCheckbox from 'components/DetailCheckbox/DetailCheckbox';
import { assetsList } from 'mocks/assetsList';
import { timeseriesList } from 'mocks/timeseriesList';
import Adapter from 'enzyme-adapter-react-16';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const { Search } = Input;
const propsCallbacks: { [name: string]: Mock } = {
  onSearch: jest.fn(),
  filterRule: jest.fn(),
  onTimeserieSelectionChange: jest.fn(),
  onError: jest.fn(),
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  propsCallbacks.onSearch.mockResolvedValue({ items: timeseriesList });
});

afterEach(() => {
  Object.keys(propsCallbacks).forEach((key: string) =>
    propsCallbacks[key].mockClear()
  );
});

// @ts-ignore
describe('TimeserieSearchAndSelect', () => {
  it('Renders without exploding', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Checks default values', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    expect(wrapper.prop('selectedTimeseries')).toEqual([]);
    expect(wrapper.state('assetId')).toEqual(undefined);
    expect(wrapper.state('fetching')).toEqual(false);
    expect(wrapper.state('searchResults')).toEqual([]);
    expect(wrapper.state('selectedTimeseries')).toEqual([]);
    expect(wrapper.state('lastFetchId')).toEqual(0);
  });

  it('should search with when input changes', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'value' } });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith({
      query: 'value',
      limit: 100,
      assetSubtrees: null,
    });
  });

  it('should update assetId with user-selected root asset id', () => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'value' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    wrapper.find('.ant-select').simulate('click');
    wrapper
      .find('.ant-select-dropdown-menu-item')
      .last()
      .simulate('click');

    expect(onSearch).toHaveBeenCalledTimes(2);
    expect(onSearch).toHaveBeenNthCalledWith(2, {
      query: 'value',
      limit: 100,
      assetSubtrees: [assetsList[assetsList.length - 1].id],
    });
  });

  it('should render search results', done => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DetailCheckbox)).toHaveLength(timeseriesList.length);
      done();
    });
  });

  it('should clear search results when input is cleared', done => {
    const { onSearch } = propsCallbacks;
    const props = { assets: assetsList, onSearch };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: '' } });
      expect(wrapper.find(DetailCheckbox)).toHaveLength(0);
      done();
    });
  });

  it('should select clicked search result', done => {
    const { onSearch, onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onSearch, onTimeserieSelectionChange };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
        .find(DetailCheckbox)
        .first()
        .simulate('click');

      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(1);
      expect(onTimeserieSelectionChange).toHaveBeenCalledWith(
        [timeseriesList[0].name],
        timeseriesList[0]
      );
      expect(
        wrapper
          .find(DetailCheckbox)
          .first()
          .find({ type: 'checkbox' })
          .first()
          .props().checked
      ).toBe(true);
      expect(
        wrapper
          .find(DetailCheckbox)
          .at(1)
          .find({ type: 'checkbox' })
          .first()
          .props().checked
      ).toBe(false);
      done();
    });
  });

  it('should give all checked results', done => {
    const { onSearch, onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onSearch, onTimeserieSelectionChange };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
        .find(DetailCheckbox)
        .first()
        .simulate('click');
      wrapper
        .find(DetailCheckbox)
        .at(1)
        .simulate('click');

      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(2);
      expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(
        2,
        [timeseriesList[0].name, timeseriesList[1].name],
        timeseriesList[1]
      );
      expect(
        wrapper
          .find(DetailCheckbox)
          .first()
          .find({ type: 'checkbox' })
          .first()
          .props().checked
      ).toBe(true);
      expect(
        wrapper
          .find(DetailCheckbox)
          .at(1)
          .find({ type: 'checkbox' })
          .first()
          .props().checked
      ).toBe(true);
      done();
    });
  });

  it('should unselect when clicking selected search result', done => {
    const { onSearch, onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onSearch, onTimeserieSelectionChange };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
        .find(DetailCheckbox)
        .first()
        .simulate('click');
      wrapper
        .find(DetailCheckbox)
        .first()
        .simulate('click');

      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(2);
      expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(
        2,
        [],
        timeseriesList[0]
      );
      expect(
        wrapper
          .find(DetailCheckbox)
          .first()
          .find({ type: 'checkbox' })
          .first()
          .props().checked
      ).toBe(false);
      done();
    });
  });

  it('should use filterRule if defined', done => {
    const { onSearch, filterRule } = propsCallbacks;
    filterRule.mockReturnValueOnce(true);
    const props = { assets: assetsList, onSearch, filterRule };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(filterRule).toHaveBeenCalledTimes(timeseriesList.length);
      expect(wrapper.find(DetailCheckbox)).toHaveLength(1);
      done();
    });
  });

  it('should call onError when api call fails', done => {
    const { onSearch, onError } = propsCallbacks;
    onSearch.mockRejectedValue(new Error('Error'));
    const props = { assets: assetsList, onSearch, onError };
    const wrapper = mount(<TimeserieSearchAndSelect {...props} />);

    wrapper
      .find(Search)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledTimes(1);

    // need this to wait for onSearch promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error('Error'));
      done();
    });
  });
});
