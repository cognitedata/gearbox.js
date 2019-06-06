import * as sdk from '@cognite/sdk';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ASSET_DATA } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetDetailsPanel, AssetDetailsPanelProps } from './AssetDetailsPanel';
import { AssetDetailsPanelPure } from './AssetDetailsPanelPure';

configure({ adapter: new Adapter() });

sdk.Assets.retrieve = jest.fn();

describe('AssetDetailsPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Assets.retrieve.mockResolvedValue(ASSET_DATA);
  });

  it('Should render without exploding and load data', done => {
    const props: AssetDetailsPanelProps = { assetId: 123 };
    const wrapper = shallow(<AssetDetailsPanel {...props} />);
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(AssetDetailsPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().asset).toEqual(ASSET_DATA);
      done();
    });
  });
});
