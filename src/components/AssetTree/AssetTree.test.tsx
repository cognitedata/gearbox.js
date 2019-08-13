import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import {
  ASSET_TREE_STYLES,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../mocks/assetsListV2';
import { MockCogniteClient } from '../../utils/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { AssetTree } from './AssetTree';

const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(
  asset => asset.rootId === asset.id
);

class CogniteClient extends MockCogniteClient {
  assets: any = {
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

configure({ adapter: new Adapter() });

beforeEach(() => {
  sdk.assets.list.mockReturnValue({
    autoPagingToArray: async () => ASSET_ZERO_DEPTH_ARRAY,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetTree', () => {
  it('renders correctly', done => {
    const tree = renderer.create(
      <ClientSDKProvider client={sdk}>
        <AssetTree
          defaultExpandedKeys={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]}
        />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      expect(tree).toMatchSnapshot();
      done();
    });
  });

  it('Checks if onSelect returns node', done => {
    const jestTest = jest.fn();
    const AssetTreeModal = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTree onSelect={jestTest} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      AssetTreeModal.update();
      AssetTreeModal.find('.ant-tree-node-content-wrapper')
        .first()
        .simulate('click');

      expect(jestTest).toBeCalled();
      expect(typeof jestTest.mock.results).toBe('object');
      done();
    });
  });
  it('rednders correctly with passed styles prop', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTree styles={ASSET_TREE_STYLES} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      wrapper.update();
      const containerStyle = wrapper
        .find('.ant-tree-treenode-switcher-close')
        .first()
        .prop('style');

      expect(containerStyle === ASSET_TREE_STYLES.list).toBeTruthy();
      done();
    });
  });
});
