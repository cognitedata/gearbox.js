import { Button, Input, Tag } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { assetsList, MockCogniteClient, timeseriesListV2 } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { DetailCheckbox } from '../common/DetailCheckbox/DetailCheckbox';
import { TimeseriesSearch } from './TimeseriesSearch';

configure({ adapter: new Adapter() });

const propsCallbacks = {
  filterRule: jest.fn(),
  onTimeserieSelectionChange: jest.fn(),
  onError: jest.fn(),
};

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: jest.fn(),
    search: jest.fn(),
  };
  assets: any = {
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

beforeEach(() => {
  sdk.timeseries.retrieve.mockResolvedValue(timeseriesListV2);
  sdk.timeseries.search.mockResolvedValue(timeseriesListV2);
  sdk.assets.list.mockResolvedValue({ items: assetsList });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesSearch', () => {
  it('Renders without exploding', () => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      onTimeserieSelectionChange,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it('Checks default values', () => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      onTimeserieSelectionChange,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );
    const timeseriesSearchComponent = wrapper.find(TimeseriesSearch);
    expect(timeseriesSearchComponent.prop('selectedTimeseries')).toEqual([]);
    expect(timeseriesSearchComponent.state('assetId')).toEqual(undefined);
    expect(timeseriesSearchComponent.state('fetching')).toEqual(false);
    expect(timeseriesSearchComponent.state('searchResults')).toEqual([]);
    expect(timeseriesSearchComponent.state('selectedTimeseries')).toEqual([]);
    expect(timeseriesSearchComponent.state('lastFetchId')).toEqual(0);
  });

  it('should search with when input changes', () => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      onTimeserieSelectionChange,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });

    expect(sdk.timeseries.search).toHaveBeenCalledTimes(1);
    expect(sdk.timeseries.search).toHaveBeenCalledWith({
      search: { query: 'value' },
      limit: 100,
      filter: { assetSubtrees: undefined },
    });
  });

  it('should update assetId with user-selected root asset id', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      onTimeserieSelectionChange,
      rootAssetSelect: true,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'value' } });
    expect(sdk.timeseries.search).toHaveBeenCalledTimes(1);

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      wrapper.find('.ant-select').simulate('click');
      wrapper
        .find('.ant-select-dropdown-menu-item')
        .last()
        .simulate('click');

      expect(sdk.timeseries.search).toHaveBeenCalledTimes(2);
      expect(sdk.timeseries.search).toHaveBeenNthCalledWith(2, {
        search: { query: 'value' },
        limit: 100,
        filter: { rootAssetIds: [assetsList[assetsList.length - 1].id] },
      });
      done();
    });
  });

  it('should render search results', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onTimeserieSelectionChange };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(sdk.timeseries.search).toHaveBeenCalledTimes(1);

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(DetailCheckbox)).toHaveLength(
        timeseriesListV2.length
      );
      expect(wrapper.find(Tag)).toHaveLength(0);
      done();
    });
  });

  it('should clear search results when input is cleared', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onTimeserieSelectionChange };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });
    expect(sdk.timeseries.search).toHaveBeenCalledTimes(1);

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
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
        [timeseriesListV2[0].id],
        timeseriesListV2[0]
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

  it('should render selected item', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { onTimeserieSelectionChange };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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

      expect(wrapper.find(Tag)).toHaveLength(1);
      expect(wrapper.find(Tag).text()).toBe(timeseriesListV2[0].name);
      done();
    });
  });

  it('should remove timeseries when tag is closed', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { onTimeserieSelectionChange };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
        [timeseriesListV2[0].id, timeseriesListV2[1].id],
        timeseriesListV2[1]
      );

      wrapper
        .find(Tag)
        .find('.anticon-close')
        .first()
        .simulate('click');
      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(3);
      expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(
        3,
        [timeseriesListV2[1].id],
        timeseriesListV2[0]
      );
      expect(wrapper.find(Tag)).toHaveLength(1);
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

  it('should give all checked results', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = { assets: assetsList, onTimeserieSelectionChange };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
        [timeseriesListV2[0].id, timeseriesListV2[1].id],
        timeseriesListV2[1]
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
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
        timeseriesListV2[0]
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
    // @ts-ignore
    sdk.timeseries.retrieve.mockResolvedValue([timeseriesListV2[1]]);
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
      selectedTimeseries: [timeseriesListV2[1].id],
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
      expect(wrapper.find(Tag).text()).toBe(timeseriesListV2[1].name);
      // @ts-ignore
      sdk.timeseries.retrieve.mockClear();
      done();
    });
  });

  it('should use filterRule if defined', done => {
    const { onTimeserieSelectionChange, filterRule } = propsCallbacks;
    filterRule.mockReturnValueOnce(true);
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
      filterRule,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

    wrapper
      .find(Input)
      .find('input')
      .simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      expect(filterRule).toHaveBeenCalledTimes(timeseriesListV2.length);
      expect(wrapper.find(DetailCheckbox)).toHaveLength(1);
      done();
    });
  });

  it('should call onError when api call fails', done => {
    const { onTimeserieSelectionChange, onError } = propsCallbacks;
    // @ts-ignore
    sdk.timeseries.search.mockRejectedValue(new Error('Error'));
    const props = { assets: assetsList, onTimeserieSelectionChange, onError };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
      single: true,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );

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
        [timeseriesListV2[0].id],
        timeseriesListV2[0]
      );
      expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(
        2,
        [timeseriesListV2[1].id],
        timeseriesListV2[1]
      );
      done();
    });
  });

  it('should select search result on arrow keys', done => {
    const { onTimeserieSelectionChange } = propsCallbacks;
    const props = {
      assets: assetsList,
      onTimeserieSelectionChange,
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <TimeseriesSearch {...props} />
      </ClientSDKProvider>
    );
    const input = wrapper.find(Input).find('input');
    input.simulate('change', { target: { value: 'a' } });

    // need this to wait for promise to complete
    setImmediate(() => {
      wrapper.update();
      input
        .simulate('keydown', { keyCode: 40 })
        .simulate('keydown', { keyCode: 40 });
      wrapper.update();

      expect(
        wrapper
          .find(DetailCheckbox)
          .at(1)
          .hasClass('active')
      ).toBeTruthy();

      input.simulate('keydown', { keyCode: 13 });
      wrapper.update();

      expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(1);
      expect(onTimeserieSelectionChange).toHaveBeenCalledWith(
        [timeseriesListV2[1].id],
        timeseriesListV2[1]
      );
      done();
    });
  });

  describe('Select all button', () => {
    it('should select all not string when allowStrings is false', done => {
      const { onTimeserieSelectionChange } = propsCallbacks;
      const props = {
        assets: assetsList,
        onTimeserieSelectionChange,
        allowStrings: false,
      };
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch {...props} />
        </ClientSDKProvider>
      );
      const input = wrapper.find(Input).find('input');
      input.simulate('change', { target: { value: 'a' } });
      // need this to wait for promise to complete
      setImmediate(() => {
        wrapper.update();
        wrapper
          .find(Button)
          .at(0)
          .simulate('click');
        expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(1);
        expect(onTimeserieSelectionChange).toHaveBeenCalledWith(
          timeseriesListV2.filter(x => !x.isString).map(x => x.id),
          null
        );
        done();
      });
    });

    it('should select all when allowStrings is true', done => {
      const { onTimeserieSelectionChange } = propsCallbacks;
      const props = {
        assets: assetsList,
        onTimeserieSelectionChange,
        allowStrings: true,
      };
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch {...props} />
        </ClientSDKProvider>
      );
      const input = wrapper.find(Input).find('input');
      input.simulate('change', { target: { value: 'a' } });
      // need this to wait for promise to complete
      setImmediate(() => {
        wrapper.update();
        wrapper
          .find(Button)
          .at(0)
          .simulate('click');
        expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(1);
        expect(onTimeserieSelectionChange).toHaveBeenCalledWith(
          timeseriesListV2.map(x => x.id),
          null
        );
        done();
      });
    });

    it('should be disabled if all already selected', done => {
      const { onTimeserieSelectionChange } = propsCallbacks;
      const props = {
        assets: assetsList,
        onTimeserieSelectionChange,
        allowStrings: false,
      };
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch {...props} />
        </ClientSDKProvider>
      );
      const input = wrapper.find(Input).find('input');
      input.simulate('change', { target: { value: 'a' } });
      // need this to wait for promise to complete
      setImmediate(() => {
        wrapper.update();
        const button = wrapper.find('button').at(0);
        expect(button.getDOMNode().hasAttribute('disabled')).toBeFalsy();
        button.simulate('click');
        expect(button.getDOMNode().hasAttribute('disabled')).toBeTruthy();

        done();
      });
    });
  });

  describe('Select none button', () => {
    it('should clear all selected ', done => {
      const { onTimeserieSelectionChange } = propsCallbacks;
      const props = {
        assets: assetsList,
        onTimeserieSelectionChange,
      };
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch {...props} />
        </ClientSDKProvider>
      );
      const input = wrapper.find(Input).find('input');
      input.simulate('change', { target: { value: 'a' } });
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
        wrapper
          .find(Button)
          .at(1)
          .simulate('click');
        expect(onTimeserieSelectionChange).toHaveBeenCalledTimes(3);
        expect(onTimeserieSelectionChange).toHaveBeenNthCalledWith(3, [], null);
        done();
      });
    });

    it('should be disabled if none are selected', done => {
      const { onTimeserieSelectionChange } = propsCallbacks;
      const props = {
        assets: assetsList,
        onTimeserieSelectionChange,
        allowStrings: false,
      };
      const wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesSearch {...props} />
        </ClientSDKProvider>
      );
      const input = wrapper.find(Input).find('input');
      input.simulate('change', { target: { value: 'a' } });
      // need this to wait for promise to complete
      setImmediate(() => {
        wrapper.update();
        const button = wrapper.find('button').at(1);
        expect(button.getDOMNode().hasAttribute('disabled')).toBeTruthy();
        done();
      });
    });
  });
});
