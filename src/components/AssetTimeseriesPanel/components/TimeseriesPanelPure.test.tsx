// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { timeseriesListV2 } from '../../../mocks';
import {
  TimeseriesPanelPure,
  TimeseriesPanelPureComponent,
} from './TimeseriesPanelPure';

configure({ adapter: new Adapter() });

const timeseries = timeseriesListV2.slice(0, 3);

describe('TimeseriesPanelPure', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <TimeseriesPanelPure assetTimeseries={timeseries} />
    ).find(TimeseriesPanelPureComponent);
    expect(wrapper.find('Styled(Collapse)')).toHaveLength(1);
    expect(wrapper.find('Styled(CollapsePanel)')).toHaveLength(3);

    wrapper
      .find('Styled(CollapsePanel)')
      .at(0)
      .simulate('click');
    expect(wrapper.find('TimeseriesChartMetaPure')).toEqual({});
  });

  it('Should match the snapshot', () => {
    const tree = renderer.create(
      <TimeseriesPanelPure assetTimeseries={timeseries} />
    );
    expect(tree).toMatchSnapshot();
  });

  it('Should render a message if timeseries are empty', () => {
    const wrapper = mount(<TimeseriesPanelPure assetTimeseries={[]} />);
    expect(wrapper.text()).toEqual('No timeseries linked to this asset');
  });

  it('Should render special message if provided and timeseries are empty', () => {
    const wrapper = mount(
      <TimeseriesPanelPure
        assetTimeseries={[]}
        strings={{ noTimeseriesSign: 'nothing found' }}
      />
    );
    expect(wrapper.find(TimeseriesPanelPureComponent).text()).toEqual(
      'nothing found'
    );
  });
});
