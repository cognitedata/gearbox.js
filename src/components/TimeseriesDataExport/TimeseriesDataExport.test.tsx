// Copyright 2020 Cognite AS
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
    retrieve: jest.fn(),
  };
  datapoints: any = {
    retrieve: jest.fn(),
    retrieveLatest: jest.fn(),
  };
}

const formIdentificator = 'Form[data-test-id="form"]';
const sdk = new CogniteClient({ appId: 'gearbox test' });
const startTimestamp = 1567351800000;
const endTimestamp = 1567408200000;
const dpStartTimestamp = startTimestamp + 1000;
const dpEndTimestamp = endTimestamp - 1000;
const defaultProps = {
  timeseriesIds: [0],
  granularity: '2m',
  defaultTimeRange: [startTimestamp, endTimestamp],
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
const onSuccess = jest.fn();
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
  sdk.datapoints.retrieve.mockResolvedValue([
    {
      id: 0,
      datapoints: [{ average: 10, timestamp: new Date(dpStartTimestamp) }],
    },
  ]);
  sdk.datapoints.retrieveLatest.mockResolvedValue([
    { id: 0, datapoints: [{ timestamp: new Date(dpEndTimestamp) }] },
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('TimeseriesDataExport', () => {
  it('renders correctly when ids are specified', async () => {
    await act(async () => {
      wrapper = mountComponent(defaultProps as TimeseriesDataExportProps);
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should be able to fetch more than 10k datapoints', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        granularity: '2s',
      } as TimeseriesDataExportProps);
    });

    wrapper.update();
    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

    expect(sdk.datapoints.retrieve).toHaveBeenCalledTimes(4);
    expect(sdk.datapoints.retrieve.mock.calls[1][0].start).toEqual(
      dpStartTimestamp
    );
    expect(sdk.datapoints.retrieve.mock.calls[3][0].end).toEqual(
      dpEndTimestamp
    );
  });

  it('should set proper limit value', async () => {
    const apiDatapointsLimit = 10000;
    const seriesNumber = 3; // 2 timeseries ids and 1 external ids
    const granularity = 2 * 1000; // 2s in milliseconds
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        timeseriesIds: [0, 1],
        timeseriesExternalIds: ['externalId-1'],
        granularity: '2s',
      } as TimeseriesDataExportProps);
    });

    wrapper.update();
    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

    const {
      start: chunkStart,
      end: chunkEnd,
      limit,
    } = sdk.datapoints.retrieve.mock.calls[1][0];

    const expectedLimit = Math.floor(apiDatapointsLimit / seriesNumber);
    expect(limit).toEqual(expectedLimit);
    expect(chunkEnd - chunkStart).toEqual(expectedLimit * granularity);
  });

  it('should trigger onSuccess callback if provided', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        onSuccess,
      } as TimeseriesDataExportProps);
    });

    wrapper.update();
    const form = wrapper.find(formIdentificator);

    await act(async () => {
      form.simulate('submit');
    });

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

  it('should be able to customize strings via callback function', async () => {
    await act(async () => {
      wrapper = mountComponent({
        ...defaultProps,
        strings: defaultStrings => ({
          csvDownload: defaultStrings.csvDownload + ' customized',
        }),
      } as TimeseriesDataExportProps);
    });

    wrapper.update();

    const submitButton = wrapper.find('button[type="submit"]');

    expect(submitButton.text()).toEqual('Download as CSV customized');
  });
});
