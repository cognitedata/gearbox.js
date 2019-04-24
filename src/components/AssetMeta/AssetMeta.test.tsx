import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ASSET_DATA, DOCUMENTS, EVENTS } from '../../mocks';
import { AssetMeta } from './AssetMeta';

sdk.Assets.retrieve = jest.fn();
sdk.Events.list = jest.fn();
sdk.Files.list = jest.fn();

configure({ adapter: new Adapter() });

beforeEach(() => {
  // @ts-ignore
  sdk.Assets.retrieve.mockImplementation(
    async (): Promise<sdk.Asset> => {
      return ASSET_DATA;
    }
  );
  // @ts-ignore
  sdk.Events.list.mockImplementation(
    async (): Promise<sdk.EventDataWithCursor> => {
      return { items: EVENTS };
    }
  );
  // @ts-ignore
  sdk.Files.list.mockImplementation(
    async (): Promise<sdk.FileMetadataWithCursor> => {
      return { items: DOCUMENTS };
    }
  );
});

describe('AssetMeta', () => {
  it('should render without exploding', done => {
    const wrapper = mount(<AssetMeta assetId={123} />);
    expect(wrapper.exists()).toBe(true);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(AssetMeta)).toHaveLength(1);
      expect(wrapper.find('h3')).toHaveLength(1);
      expect(wrapper.find('h3 + p')).toHaveLength(1);
      expect(wrapper.find('TabBar')).toHaveLength(1);
      expect(wrapper.find('div.ant-tabs-tab')).toHaveLength(3);
      expect(wrapper.find('TabPane')).toHaveLength(3);
      done();
    });
  });
});
