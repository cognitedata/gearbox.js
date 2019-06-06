import * as sdk from '@cognite/sdk';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesList } from '../../mocks';
import { LoadingBlock } from '../common/LoadingBlock/LoadingBlock';
import {
  AssetTimeseriesPanel,
  AssetTimeseriesPanelProps,
} from './AssetTimeseriesPanel';
import { TimeseriesPanelPure } from './components/TimeseriesPanelPure';

configure({ adapter: new Adapter() });

sdk.TimeSeries.list = jest.fn();

describe('AssetTimeseriesPanel', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.TimeSeries.list.mockResolvedValue({ items: timeseriesList });
  });

  it('Should render without exploding and load data', done => {
    const props: AssetTimeseriesPanelProps = { assetId: 123 };
    const wrapper = shallow(<AssetTimeseriesPanel {...props} />);
    expect(wrapper.find(LoadingBlock)).toHaveLength(1);

    setImmediate(() => {
      wrapper.update();
      const pureComponent = wrapper.find(TimeseriesPanelPure);
      expect(pureComponent).toHaveLength(1);
      expect(pureComponent.props().assetTimeseries).toEqual(timeseriesList);
      done();
    });
  });
});
