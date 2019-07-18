import { API } from '@cognite/sdk/dist/src/resources/api';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { datapointsList, timeseriesListV2 } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { TimeseriesChartMetaPure } from './TimeseriesChartMetaPure';

configure({ adapter: new Adapter() });

const timeseries = timeseriesListV2[0];

const fakeClient: API = {
  // @ts-ignore
  timeseries: {
    retrieve: jest.fn(),
  },
  // @ts-ignore
  datapoints: {
    retrieve: jest.fn(),
    retrieveLatest: jest.fn(),
  },
};

describe('TimeseriesChartMeta', () => {
  beforeEach(() => {
    // @ts-ignore
    fakeClient.timeseries.retrieve.mockResolvedValue([timeseriesListV2[0]]);
    // @ts-ignore
    fakeClient.datapoints.retrieve.mockResolvedValue(datapointsList);
    // @ts-ignore
    fakeClient.datapoints.retrieveLatest.mockResolvedValue([
      { isString: false, datapoints: [{ value: 25.0 }] },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const activeLabelSelector = 'label.ant-radio-button-wrapper-checked';

  it('Should render without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure timeseries={timeseries} />
      </ClientSDKProvider>
    );
    expect(wrapper.find('RadioGroup')).toHaveLength(1);
    expect(wrapper.find('TimeseriesChart')).toHaveLength(1);
    expect(wrapper.find('TimeseriesValue')).toHaveLength(1);
    expect(wrapper.find('[metaInfo]')).toHaveLength(1);
  });

  it('Should not render elements if they are hidden', () => {
    const wrapper = shallow(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure
          showPeriods={false}
          showChart={false}
          showDatapoint={false}
          showMetadata={false}
          timeseries={timeseries}
        />
      </ClientSDKProvider>
    );
    expect(wrapper.find('RadioGroup')).toHaveLength(0);
    expect(wrapper.find('TimeseriesChart')).toHaveLength(0);
    expect(wrapper.find('TimeseriesValue')).toHaveLength(0);
    expect(wrapper.find('[metaInfo]')).toHaveLength(0);
  });

  it('Should have default period 1 hour', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure timeseries={timeseries} />
      </ClientSDKProvider>
    );
    expect(wrapper).toHaveLength(1);
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(1);
    expect(checkedLabel.text()).toEqual('1 hour');
  });

  it('Should not have active period selected if defaultBasePeriod has been provided', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure
          timeseries={timeseries}
          defaultBasePeriod={{
            startTime: Date.now() - 1000000,
            endTime: Date.now(),
          }}
        />
      </ClientSDKProvider>
    );
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(0);
  });

  it('Should switch period on click', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure timeseries={timeseries} />
      </ClientSDKProvider>
    );
    const radioInputs = wrapper.find('input.ant-radio-button-input');
    radioInputs.first().simulate('change', { target: { checked: true } });
    const checkedLabel = wrapper.find(activeLabelSelector);
    expect(checkedLabel).toHaveLength(1);
    expect(checkedLabel.text()).toEqual('1 year');
  });

  it('Should render nothing if timeseries is null or undefined', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
        <TimeseriesChartMetaPure
          // @ts-ignore
          timeseries={null}
        />
      </ClientSDKProvider>
    );
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });
});
