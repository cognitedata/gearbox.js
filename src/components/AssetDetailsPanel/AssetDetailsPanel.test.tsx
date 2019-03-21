import { configure } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { ASSET_META_DATA_SOURCE } from 'mocks/assets';
import AssetDetailsPanel, { AssetDetailsColumns } from './AssetDetailsPanel';

configure({ adapter: new Adapter() });

describe('TenantSelector', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <div>
          <AssetDetailsPanel
            dataSource={ASSET_META_DATA_SOURCE}
            columns={AssetDetailsColumns}
          />
          <AssetDetailsPanel dataSource={[]} columns={AssetDetailsColumns} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
