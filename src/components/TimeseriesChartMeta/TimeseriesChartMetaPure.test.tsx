import * as sdk from '@cognite/sdk';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapoints, timeseriesList } from '../../mocks';
import { TimeseriesChartMetaPure } from './TimeseriesChartMetaPure';

configure({ adapter: new Adapter() });

sdk.Datapoints.retrieveLatest = jest.fn();

const timeseries = timeseriesList[0];
const datapopint = datapoints[0];

beforeEach(() => {
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockResolvedValue(datapopint);
});

afterEach(() => {
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockClear();
});

describe('TimeseriesChartMeta', () => {
  const activeLabelSelector = 'label.ant-radio-button-wrapper-checked';

  it('Should render without exploding', () => {
    const wrapper = shallow(
      <TimeseriesChartMetaPure timeseries={timeseries} />
    );
    expect(wrapper.find('RadioGroup')).toHaveLength(1);
    expect(wrapper.find('TimeseriesChart')).toHaveLength(1);
    expect(wrapper.find('TimeseriesValue')).toHaveLength(1);
    expect(wrapper.find('[metaInfo]')).toHaveLength(1);
  });

  it('Should not render elements if they are hidden', () => {
    const wrapper = shallow(
      <TimeseriesChartMetaPure
        showPeriods={false}
        showChart={false}
        showDatapoint={false}
        showMetadata={false}
        timeseries={timeseries}
      />
    );
    expect(wrapper.find('RadioGroup')).toHaveLength(0);
    expect(wrapper.find('TimeseriesChart')).toHaveLength(0);
    expect(wrapper.find('TimeseriesValue')).toHaveLength(0);
    expect(wrapper.find('[metaInfo]')).toHaveLength(0);
  });

  it('Should have default period 1 hour', () => {
    const wrapper = mount(<TimeseriesChartMetaPure timeseries={timeseries} />);
    expect(wrapper).toHaveLength(1);
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(1);
    expect(checkedLabel.text()).toEqual('1 hour');
  });

  it('Should not have active period selected is defaultBasePeriod has been provided', () => {
    const wrapper = mount(
      <TimeseriesChartMetaPure
        timeseries={timeseries}
        defaultBasePeriod={{
          startTime: Date.now() - 1000000,
          endTime: Date.now(),
        }}
      />
    );
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(0);
  });

  it('Should switch period on click', () => {
    const wrapper = mount(<TimeseriesChartMetaPure timeseries={timeseries} />);
    const radioInputs = wrapper.find('input.ant-radio-button-input');
    radioInputs.first().simulate('change', { target: { checked: true } });
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(1);
    expect(checkedLabel.text()).toEqual('1 year');
  });

  it('Should render nothing if timeseries is null or undefined', () => {
    // @ts-ignore
    const wrapper = mount(<TimeseriesChartMetaPure timeseries={null} />);
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });
});
