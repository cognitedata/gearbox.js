import { configure } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { ASSET_META_DATA_SOURCE } from 'mocks/assets';
import AssetDetailsPanel from './AssetDetailsPanel';

configure({ adapter: new Adapter() });

describe('AssetDetailsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <div>
          <AssetDetailsPanel dataSource={ASSET_META_DATA_SOURCE} />
          <AssetDetailsPanel dataSource={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
