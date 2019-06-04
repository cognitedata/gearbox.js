import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';
import { timeseriesList } from '../../../mocks';
import { TimeseriesPanel } from './TimeseriesPanel';

configure({ adapter: new Adapter() });

const timeseries = timeseriesList.slice(0, 3);

describe('TimeseriesPanel', () => {
  it('Renders without exploding', () => {
    const wrapper = shallow(<TimeseriesPanel timeseries={timeseries} />);
    expect(wrapper.find('Styled(Collapse)')).toHaveLength(1);
    expect(wrapper.find('Styled(CollapsePanel)')).toHaveLength(3);
    expect(wrapper.find('TimeseriesChartMetaPure')).toHaveLength(3);
  });

  it('Should match the snapshot', () => {
    const tree = renderer.create(<TimeseriesPanel timeseries={timeseries} />);
    expect(tree).toMatchSnapshot();
  });

  it('Should render a message if timeseries are empty', () => {
    const wrapper = shallow(<TimeseriesPanel timeseries={[]} />);
    expect(wrapper.text()).toEqual('No timeseries linked to this asset');
  });

  it('Should render special message if provided and timeseries are empty', () => {
    const wrapper = shallow(
      <TimeseriesPanel
        timeseries={[]}
        strings={{ noTimeseriesSign: 'nothing found' }}
      />
    );
    expect(wrapper.text()).toEqual('nothing found');
  });
});
