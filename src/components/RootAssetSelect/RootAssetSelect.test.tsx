import React from 'react';
import { mount, configure } from 'enzyme';
import RootAssetSelect from './RootAssetSelect';
import { assetsList } from 'mocks/assetsList';
import { VIdCallback, VId } from 'utils/validators';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const onAssetSelected: VIdCallback = (id: VId) => id;

describe('EventPreview', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<RootAssetSelect assets={assetsList} onAssetSelected={onAssetSelected}/>);
    expect(wrapper).toHaveLength(1);
  });
});
