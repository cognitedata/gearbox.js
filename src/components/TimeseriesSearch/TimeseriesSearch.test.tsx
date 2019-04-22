import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Input } from 'antd';
import lodash from 'lodash';
import * as sdk from '@cognite/sdk';
import { TimeseriesSearch } from './TimeseriesSearch';
import { DetailCheckbox } from '../DetailCheckbox/DetailCheckbox';
import { assetsList, timeseriesList } from '../../mocks';

configure({ adapter: new Adapter() });

sdk.TimeSeries.search = jest.fn();
sdk.Assets.list = jest.fn();

const propsCallbacks = {
  filterRule: jest.fn(),
  onTimeserieSelectionChange: jest.fn(),
  onError: jest.fn(),
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  // @ts-ignore
  sdk.TimeSeries.search.mockResolvedValue({ items: timeseriesList });
  // @ts-ignore
  sdk.Assets.list.mockResolvedValue({ items: assetsList });
});

afterEach(() => {
  propsCallbacks.filterRule.mockClear();
  propsCallbacks.onTimeserieSelectionChange.mockClear();
  propsCallbacks.onError.mockClear();
  // @ts-ignore
  sdk.TimeSeries.search.mockClear();
});

// tslint:disable:no-big-function
describe('TimeseriesSearch', () => {
  it('Renders without exploding', () => {
    const props = {};
    const wrapper = mount(<TimeseriesSearch {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Checks default values', () => {
    const props = {};
    const wrapper = mount(<TimeseriesSearch {...props} />);

    expect(wrapper.prop('selectedTimeseries')).toEqual([]);
    expect(wrapper.state('assetId')).toEqual(undefined);
    expect(wrapper.state('fetching')).toEqual(false);
    expect(wrapper.state('searchResults')).toEqual([]);
    expect(wrapper.state('selectedTimeseries')).toEqual([]);
    expect(wrapper.state('lastFetchId')).toEqual(0);
  });

  it('should search with when input changes', () => {
    const props = {};
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });

    expect(sdk.TimeSeries.search).toHaveBeenCalledTimes(1);
    expect(sdk.TimeSeries.search).toHaveBeenCalledWith({
      query: 'value',
      limit: 100,
      assetSubtrees: undefined,
    });
  });

  it('should update assetId with user-selected root asset id', done => {
    const props = {};
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });
    expect(sdk.TimeSeries.search).toHaveBeenCalledTimes(1);

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper.find('.ant-select').simulate('click');
      wrapper
        .find('.ant-select-dropdown-menu-item')
        .last()
        .simulate('click');

      expect(sdk.TimeSeries.search).toHaveBeenCalledTimes(2);
      expect(sdk.TimeSeries.search).toHaveBeenNthCalledWith(2, {
        query: 'value',
        limit: 100,
        assetSubtrees: [assetsList[assetsList.length - 1].id],
      });
      done();
    });
  });

  it('should render search results', done => {
    const props = { assets: assetsList };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(sdk.TimeSeries.search).toHaveBeenCalledTimes(1);

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DetailCheckbox)).toHaveLength(timeseriesList.length);
      done();
    });
  });

  it('should clear search results when input is cleared', done => {
    const props = { assets: assetsList };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(sdk.TimeSeries.search).toHaveBeenCalledTimes(1);

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
        .find(Input)
        .find('input')
        .simulate('change', { target: { value: '' } });
      expect(wrapper.find(DetailCheckbox)).toHaveLength(0);
      done();
    });
  });

  it('should select clicked search result', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { onTimeserieSelectionChange };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper
        .find(DetailCheckbox)
        .first()
        .simulate('click');

      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(1);
      expect(onTimeserieSelectionChange).toHaveBeenCalledWith(
        [timeseriesList[0].id],
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
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onTimeserieSelectionChange };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
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
        [timeseriesList[0].id, timeseriesList[1].id],
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
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onTimeserieSelectionChange };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
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

  it('should preselect', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
      selectedTimeseries: [timeseriesList[1].id],
    };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
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

  it('should use filterRule if defined', done => {
    const { filterRule } = propsCallbacks;
    filterRule.mockReturnValueOnce(true);
    const props = { assets: assetsList, filterRule };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(filterRule).toHaveBeenCalledTimes(timeseriesList.length);
      expect(wrapper.find(DetailCheckbox)).toHaveLength(1);
      done();
    });
  });

  it('should call onError when api call fails', done => {
    const { onError } = propsCallbacks;
    // @ts-ignore
    sdk.TimeSeries.search.mockRejectedValue(new Error('Error'));
    const props = { assets: assetsList, onError };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error('Error'));
      done();
    });
  });

  it('should not render checkboxes when single is true', done => {
    const props = { assets: assetsList, single: true };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find({ type: 'checkbox' })).toHaveLength(0);
      done();
    });
  });

  it('should always return selected when single is true', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
      single: true,
    };
    const wrapper = mount(<TimeseriesSearch {...props} />);

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
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
        1,
        [timeseriesList[0].id],
        timeseriesList[0]
      );
      expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(
        2,
        [timeseriesList[1].id],
        timeseriesList[1]
      );
      done();
    });
  });
});
