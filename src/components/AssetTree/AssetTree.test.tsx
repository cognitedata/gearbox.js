import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { ASSET_LIST_CHILD, ASSET_ZERO_DEPTH_ARRAY } from '../../mocks';
import { AssetTree } from './AssetTree';

const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(asset => asset.depth === 0);

configure({ adapter: new Adapter() });

sdk.Assets.list = jest.fn();
sdk.Assets.listDescendants = jest.fn();

beforeEach(() => {
  // @ts-ignore
  sdk.Assets.list.mockResolvedValue({ items: ASSET_ZERO_DEPTH_ARRAY });
  // @ts-ignore
  sdk.Assets.listDescendants.mockResolvedValue({ items: ASSET_LIST_CHILD });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetTree', () => {
  it('renders correctly', done => {
    const tree = renderer.create(
      <AssetTree defaultExpandedKeys={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]} />
    );
    setImmediate(() => {
      expect(tree).toMatchSnapshot();
      done();
    });
  });

  it('Checks if onSelect returns node', done => {
    const jestTest = jest.fn();
    const AssetTreeModal = mount(<AssetTree onSelect={jestTest} />);
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
});
