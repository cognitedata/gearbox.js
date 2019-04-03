import { configure } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { ASSET_DATA } from 'mocks/assets';
import DescriptionList from './DescriptionList';

configure({ adapter: new Adapter() });

describe('AssetDetailsPanel', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <div>
          <DescriptionList valueSet={ASSET_DATA.metadata} />
          <DescriptionList valueSet={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
