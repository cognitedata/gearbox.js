import { configure, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { AssetTree } from './AssetTree';
import { ASSET_LIST_CHILD } from '../../mocks';

const zeroChild = ASSET_LIST_CHILD.findIndex(asset => asset.depth === 0);

configure({ adapter: new Adapter() });

describe('AssetTree', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <AssetTree
          assets={ASSET_LIST_CHILD}
          defaultExpandedKeys={[String(ASSET_LIST_CHILD[zeroChild].id)]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Checks if onSelect returns node', () => {
    const jestTest = jest.fn();
    const AssetTreeModal = mount(
      <AssetTree assets={ASSET_LIST_CHILD} onSelect={jestTest} />
    );
    AssetTreeModal.find('.ant-tree-node-content-wrapper')
      .first()
      .simulate('click');

    expect(jestTest).toBeCalled();
    expect(typeof jestTest.mock.results).toBe('object');
  });
});
