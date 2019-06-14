import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import {
  ASSET_TREE_STYLES,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../mocks/assetsListV2';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { AssetTree } from './AssetTree';

const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(asset => asset.depth === 0);

const mockedClient: API = {
  // @ts-ignore
  assets: {
    retrieve: jest.fn(),
  },
};

configure({ adapter: new Adapter() });

beforeEach(() => {
  // @ts-ignore
  mockedClient.assets.list.mockResolvedValue({
    autoPagingToArray: async () => [ASSET_ZERO_DEPTH_ARRAY],
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetTree', () => {
  it('renders correctly', done => {
    const tree = renderer.create(
      <ClientSDKProvider client={mockedClient}>
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

  xit('Checks if onSelect returns node', done => {
    const jestTest = jest.fn();
    const AssetTreeModal = mount(
      <ClientSDKProvider client={mockedClient}>
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
  xit('rednders correctly with passed styles prop', done => {
    const wrapper = mount(<AssetTree styles={ASSET_TREE_STYLES} />);
    setImmediate(() => {
      wrapper.update();
      const containerStyle = wrapper
        .find('li')
        .first()
        .prop('style');
      expect(containerStyle === ASSET_TREE_STYLES.list).toBeTruthy();
      done();
    });
  });
});
