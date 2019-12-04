import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { AssetTree } from '../components/AssetTree';
import { ClientSDKProvider } from '../components/ClientSDKProvider';
import { TimeseriesPreview } from '../components/TimeseriesPreview';
import { version } from '../constants/replacedStrings';
import { MockCogniteClient } from '../mocks/mockSdk';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: jest.fn(),
  };
  datapoints: any = {
    retrieveLatest: jest.fn(),
  };
  assets: any = {
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });
sdk.timeseries.retrieve.mockResolvedValue([]);
sdk.datapoints.retrieveLatest.mockResolvedValue([]);
sdk.assets.list.mockReturnValue({ autoPagingToArray: async () => [] });

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe('clientSDKProxyProvider', () => {
  it('it calls setOneTimeHeader with component name', async () => {
    let wrapper: ReactWrapper = new ReactWrapper(<></>);
    sdk.setOneTimeSdkHeader = jest.fn();

    await act(async () => {
      wrapper = mount(
        <ClientSDKProvider client={sdk}>
          <TimeseriesPreview timeseriesId={0} />
        </ClientSDKProvider>
      );
    });

    expect(sdk.setOneTimeSdkHeader).toHaveBeenCalledWith(
      `CogniteGearbox:${version}/TimeseriesPreview`
    );
    expect(sdk.setOneTimeSdkHeader).toHaveBeenCalledTimes(1);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('it works with class components', async () => {
    sdk.setOneTimeSdkHeader = jest.fn();

    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTree />
      </ClientSDKProvider>
    );

    expect(sdk.setOneTimeSdkHeader).toHaveBeenCalledWith(
      `CogniteGearbox:${version}/AssetTree`
    );
    expect(sdk.setOneTimeSdkHeader).toHaveBeenCalledTimes(1);
    expect(wrapper.exists()).toBeTruthy();
  });
});
