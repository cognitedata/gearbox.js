import { Tree } from 'antd';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { sleep } from '../../mocks';
import {
  ASSET_LIST_CHILD,
  ASSET_TREE_STYLES,
  ASSET_ZERO_DEPTH_ARRAY,
} from '../../mocks/assetsListV2';
import { MockCogniteClient } from '../../mocks/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { AssetTree } from './AssetTree';

const zeroChild = ASSET_ZERO_DEPTH_ARRAY.findIndex(
  asset => asset.rootId === asset.id
);

class CogniteClient extends MockCogniteClient {
  assets: any = {
    list: jest.fn(),
    retrieve: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

configure({ adapter: new Adapter() });

beforeEach(() => {
  sdk.assets.list.mockImplementation(({ filter: { parentIds } }: any) => ({
    autoPagingToArray: async () => {
      if (parentIds) {
        return ASSET_LIST_CHILD.filter(({ parentId }) =>
          parentIds.includes(parentId)
        );
      } else {
        return ASSET_ZERO_DEPTH_ARRAY;
      }
    },
  }));
  sdk.assets.retrieve.mockImplementation((ids: { id: number }[]) => {
    const idsToFind = ids.map(({ id }) => id);
    return ASSET_LIST_CHILD.filter(({ id }) => idsToFind.includes(id));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetTree', () => {
  // fix this afterwards
  // it('renders correctly', done => {
  //   const tree = renderer.create(
  //     <ClientSDKProvider client={sdk}>
  //       <AssetTree
  //         defaultExpandedKeys={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]}
  //       />
  //     </ClientSDKProvider>
  //   );
  //   setImmediate(() => {
  //     expect(tree).toMatchSnapshot();
  //     done();
  //   });
  // });

  it('renders correctly with assetIds', done => {
    const tree = renderer.create(
      <ClientSDKProvider client={sdk}>
        <AssetTree assetIds={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      expect(tree).toMatchSnapshot();
      done();
    });
  });

  it('renders correctly when assetIds property reset', async () => {
    const AssetTreeModal = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTree assetIds={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]} />
      </ClientSDKProvider>
    );

    await sleep(0);
    AssetTreeModal.update();
    AssetTreeModal.find('.ant-tree-switcher')
      .first()
      .simulate('click');

    await sleep(0);
    AssetTreeModal.update();
    const treeNodesFirstExpanded = AssetTreeModal.find(Tree.TreeNode)
      .map(node => node.props())
      .map(({ eventKey }) => Number(eventKey));
    expect(treeNodesFirstExpanded).toEqual([
      6687602007296940,
      4650652196144007,
    ]);
    expect(sdk.assets.retrieve).toBeCalledWith([{ id: 6687602007296940 }]);
    AssetTreeModal.setProps({
      children: <AssetTree assetIds={undefined} />,
    });

    await sleep(0);
    AssetTreeModal.update();
    AssetTreeModal.setProps({
      children: <AssetTree assetIds={[ASSET_ZERO_DEPTH_ARRAY[zeroChild].id]} />,
    });

    await sleep(0);
    AssetTreeModal.update();
    AssetTreeModal.find('.ant-tree-switcher')
      .first()
      .simulate('click');

    await sleep(0);
    AssetTreeModal.update();
    expect(sdk.assets.list).toBeCalledTimes(2);
    expect(
      AssetTreeModal.find(Tree.TreeNode)
        .map(node => node.props())
        .map(({ eventKey }) => Number(eventKey))
    ).toEqual(treeNodesFirstExpanded);
    expect(sdk.assets.retrieve).toBeCalledTimes(2);
  });

  it('Checks if onSelect is being called', done => {
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
      expect(jestTest.mock.results[0].value).toBe(undefined);
      expect(Object.keys(jestTest.mock.calls[0][0]).sort()).toEqual(
        ['node', 'key', 'isLeaf', 'title'].sort()
      );
      done();
    });
  });

  it("Don't show expand arrows if child count > 0", done => {
    const AssetTreeModal = mount(
      <ClientSDKProvider client={sdk}>
        <AssetTree />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      AssetTreeModal.update();

      expect(
        AssetTreeModal.find(Tree.TreeNode)
          .map(node => node.props())
          .map(({ eventKey, isLeaf }) => ({ id: Number(eventKey), isLeaf }))
      ).toEqual(
        ASSET_ZERO_DEPTH_ARRAY.map(({ id, aggregates }) => ({
          id,
          isLeaf: aggregates ? !aggregates.childCount : false,
        }))
      );

      done();
    });
  });

  it('renders correctly with passed styles prop', done => {
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

  it('renders correctly with after changed the displayName prop', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>null</ClientSDKProvider>
    );
    wrapper.setProps({
      children: <AssetTree displayName={asset => `${asset.id}`} />,
    });

    const testItemToMatchText = (text: string) => {
      const str = wrapper
        .find('.ant-tree-title')
        .first()
        .text();
      expect(str).toBe(text);
    };

    setImmediate(() => {
      wrapper.update();
      testItemToMatchText('6687602007296940');

      wrapper.setProps({
        children: <AssetTree displayName={asset => `${asset.name}`} />,
      });
      setImmediate(() => {
        wrapper.update();
        testItemToMatchText('Aker BP');
        done();
      });
    });
  });
});
