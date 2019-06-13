import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { fakeAsset } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetDetailsPanel, AssetDetailsPanelProps } from './AssetDetailsPanel';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';

configure({ adapter: new Adapter() });

const fakeClient: API = {
  // @ts-ignore
  assets: {
    retrieve: jest.fn(),
  },
};

describe('AssetDetailsPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    fakeClient.assets.retrieve.mockResolvedValue([fakeAsset]);
  });

  afterEach(() => {
    // @ts-ignore
    fakeClient.assets.retrieve.mockClear();
  });

  it('Should render without exploding and load data', done => {
    const props: AssetDetailsPanelProps = { assetId: 123 };
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
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
});
