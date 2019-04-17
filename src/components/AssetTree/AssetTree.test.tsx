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

  it('Should update tree on assets props change', done => {
    const rootNodes = ASSET_LIST_CHILD.filter(o => o.depth === 0);
    const AssetTreeModal = mount(<AssetTree assets={rootNodes} />);
    expect(AssetTreeModal.find('TreeNode')).toHaveLength(2);

    AssetTreeModal.setProps(
      {
        assets: [rootNodes[0]],
      },
      () => {
        expect(AssetTreeModal.find('TreeNode')).toHaveLength(1);
        done();
      }
    );
  });
});
