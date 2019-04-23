import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { ASSET_DATA } from '../../mocks';
import { DescriptionList } from './DescriptionList';

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
