import * as sdk from '@cognite/sdk';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { EVENTS } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import { AssetEventsPanel, AssetEventsPanelProps } from './AssetEventsPanel';
import { AssetEventsPanelPure } from './components/AssetEventsPanelPure';

configure({ adapter: new Adapter() });

sdk.Events.list = jest.fn();

describe('AssetEventsPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Events.list.mockResolvedValue({ items: EVENTS });
  });

  it('Should render without exploding and load data', done => {
    const props: AssetEventsPanelProps = { assetId: 123 };
    const wrapper = shallow(<AssetEventsPanel {...props} />);
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(AssetEventsPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetEvents).toEqual(EVENTS);
      done();
    });
  });
});
