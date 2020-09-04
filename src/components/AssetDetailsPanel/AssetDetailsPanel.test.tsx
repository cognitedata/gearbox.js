// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { fakeAsset, MockCogniteClient } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetDetailsPanel } from './AssetDetailsPanel';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';
import { AssetDetailsPanelProps } from './interfaces';

configure({ adapter: new Adapter() });

const mockAssetList = jest.fn();

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: mockAssetList,
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('AssetDetailsPanel', () => {
  beforeEach(() => {
    mockAssetList.mockResolvedValue([fakeAsset]);
  });

  afterEach(() => {
    mockAssetList.mockClear();
  });

  it('Should render without exploding and load data', done => {
    const props: AssetDetailsPanelProps = { assetId: 123 };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetDetailsPanel {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(AssetDetailsPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().asset).toEqual(fakeAsset);
      done();
    });
  });

  it('Should render categories', done => {
    const props: AssetDetailsPanelProps = {
      assetId: 123,
      toCategory: name => (name.charCodeAt(0) % 3).toString(),
    };
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetDetailsPanel {...props} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.ant-collapse-header').length).toBe(3);
      done();
    });
  });
});
