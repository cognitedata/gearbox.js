import { configure } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { ASSET_META_DATA_SOURCE } from 'mocks/assets';
import DescriptionList from './DescriptionList';

configure({ adapter: new Adapter() });

describe('AssetDetailsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <div>
          <DescriptionList valueSet={ASSET_META_DATA_SOURCE} />
          <DescriptionList valueSet={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
