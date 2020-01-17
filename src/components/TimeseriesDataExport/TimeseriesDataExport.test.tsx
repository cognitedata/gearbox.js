import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MockCogniteClient } from '../../mocks';
import { LabelFormatter } from '../../utils/csv';
import * as csv from '../../utils/csv';
import { ClientSDKProvider } from '../ClientSDKProvider';
import {
  FetchCSVCall,
  FetchTimeseriesCall,
  TimeseriesDataExportProps,
} from './interfaces';
import { TimeseriesDataExport } from './TimeseriesDataExport';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: jest.fn().mockReturnValue([{ id: 0 }]),
  };
  datapoints: any = {
    retrieve: jest.fn(),
  };
}

const formIdentificator = 'Form[data-test-id="form"]';
const sdk = new CogniteClient({ appId: 'gearbox test' });
const defaultProps = {
  timeseriesIds: [0],
  granularity: '2m',
  defaultTimeRange: [1567321800000, 1567408200000],
  visible: true,
};
const labelFormatter = jest.fn().mockReturnValue('name') as LabelFormatter;
const fetchCSV = jest
  .fn()
  .mockReturnValue(
    Promise.resolve('timestamp,value1,value2\n')
  ) as FetchCSVCall;
const retrieveTimeseries = jest
  .fn()
  .mockReturnValue(
    Promise.resolve([{ id: 1 }, { id: 2 }])
  ) as FetchTimeseriesCall;
const onSuccess = jest.fn() as () => void;
const mountComponent = (props: TimeseriesDataExportProps) =>
  mount(
    <ClientSDKProvider client={sdk}>
      <TimeseriesDataExport {...props} />
    </ClientSDKProvider>
  );

jest.spyOn(csv, 'downloadCSV').mockImplementation(() => null);

let wrapper: ReactWrapper;

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
  sdk.timeseries.retrieve.mockResolvedValue([{ id: 0 }]);
  sdk.datapoints.retrieve.mockResolvedValue([{ id: 0, datapoints: [] }]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesChart', () => {
  it('renders correctly when ids are specified', async () => {
    await act(async () => {
      wrapper = mountComponent(defaultProps as TimeseriesDataExportProps);
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should show omit datapoints limit alert', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        granularity: '2s',
      } as TimeseriesDataExportProps);
    });

    wrapper.update();

    expect(wrapper.find('[data-test-id="alert"]').exists()).toBeTruthy();
  });

  it('should use internal retrieveTimeseries and fetchCSV calls', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        onSuccess,
      } as TimeseriesDataExportProps);
    });

    wrapper.update();

    expect(sdk.timeseries.retrieve).toHaveBeenCalled();

    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

    expect(sdk.datapoints.retrieve).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should use provided retrieveTimeseries and fetchCSV', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        fetchCSV,
        retrieveTimeseries,
      } as TimeseriesDataExportProps);
    });

    wrapper.update();

    expect(retrieveTimeseries).toHaveBeenCalled();

    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

    expect(fetchCSV).toHaveBeenCalled();
  });

  it('should format column name with provided formatter', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        labelFormatter,
      } as TimeseriesDataExportProps);
    });

    wrapper.update();

    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

    expect(labelFormatter).toHaveBeenCalledTimes(1);
  });
});
