// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import lodash from 'lodash';
import {
  assetsList,
  timeseriesListV2,
  fakeEvents,
  fakeFiles,
  MockCogniteClient,
} from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { GlobalSearch } from './GlobalSearchComponent';

configure({ adapter: new Adapter() });

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

class CogniteClient extends MockCogniteClient {
  assets: any = {
    search: (query: any) => {
      if (query.search && query.search.query === 'empty') {
        return Promise.resolve([]);
      }

      if (query.search && query.search.query === 'error') {
        return Promise.reject(new Error('sdk search request failed'));
      }

      if (query.search && query.search.query === 'loading') {
        return new Promise(_ => {
          // Never resolves
        });
      }

      return Promise.resolve(assetsList);
    },
  };
  timeseries: any = {
    search: () => {
      return Promise.resolve(timeseriesListV2);
    },
  };
  files: any = {
    search: () => {
      return Promise.resolve(fakeFiles);
    },
  };
  events: any = {
    search: () => {
      return Promise.resolve(fakeEvents);
    },
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('GlobalSearch', () => {
  it('should render without exploding', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <GlobalSearch />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(GlobalSearch)).toHaveLength(1);
      done();
    });
  });

  it('should render loading spinner', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <GlobalSearch />
      </ClientSDKProvider>
    );
    wrapper.find('input').simulate('change', { target: { value: 'loading' } });
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.anticon-loading')).toHaveLength(1);
      done();
    });
  });

  it('should pass error', done => {
    const handleError = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <GlobalSearch onError={handleError} />
      </ClientSDKProvider>
    );
    wrapper.find('input').simulate('change', { target: { value: 'error' } });
    setImmediate(() => {
      wrapper.update();
      expect(handleError).toBeCalled();
      done();
    });
  });

  it('should call onSearchResults with results', done => {
    const handleSearchResults = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <GlobalSearch onSearchResults={handleSearchResults} />
      </ClientSDKProvider>
    );
    wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    setImmediate(() => {
      wrapper.update();
      expect(handleSearchResults.mock.calls[0][0].length).toBeGreaterThan(0);
      done();
    });
  });
});
