// Copyright 2020 Cognite AS
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import lodash from 'lodash';
import { act } from 'react-dom/test-utils';
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

let wrapper: ReactWrapper;
const sdk = new CogniteClient({ appId: 'gearbox test' });

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
});

afterEach(() => {
  wrapper.unmount();
});

describe('GlobalSearch', () => {
  it('should render without exploding', async () => {
    await act(async () => {
      wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <GlobalSearch />
        </ClientSDKProvider>
      );
    });
    wrapper.update();
    expect(wrapper.find(GlobalSearch)).toHaveLength(1);
  });

  it('should render loading spinner', async () => {
    await act(async () => {
      wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <GlobalSearch />
        </ClientSDKProvider>
      );
    });

    const input = wrapper.find('input');

    await act(async () => {
      input.simulate('change', { target: { value: 'loading' } });
    });

    wrapper.update();

    expect(wrapper.find('.anticon-loading')).toHaveLength(1);
  });

  it('should pass error', async () => {
    const handleError = jest.fn();
    await act(async () => {
      wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <GlobalSearch onError={handleError} />
        </ClientSDKProvider>
      );
    });
    const input = wrapper.find('input');

    await act(async () => {
      input.simulate('change', { target: { value: 'error' } });
    });

    wrapper.update();

    expect(handleError).toBeCalled();
  });

  it('should call onSearchResults with results', async () => {
    const handleSearchResults = jest.fn();
    let wrapper: ReactWrapper = new ReactWrapper(<div />);

    await act(async () => {
      wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <GlobalSearch onSearchResults={handleSearchResults} />
        </ClientSDKProvider>
      );
    });

    const input = wrapper.find('input');

    await act(async () => {
      input.simulate('change', { target: { value: 'foo' } });
    });

    wrapper.update();

    expect(handleSearchResults.mock.calls[0][0].length).toBeGreaterThan(0);
  });
});
