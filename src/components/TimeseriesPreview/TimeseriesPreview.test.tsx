import { Dropdown } from 'antd';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment-timezone';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { randomLatestDatapoint, singleTimeseries } from '../../mocks';
import { MockCogniteClient } from '../../mocks/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import {
  TimeseriesPreview,
  TimeseriesPreviewMenuConfig,
  TimeseriesPreviewProps,
} from './TimeseriesPreview';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  timeseries: any = {
    retrieve: jest.fn(),
  };
  datapoints: any = {
    retrieveLatest: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });
const defaultProps = {
  timeseriesId: 0,
};

let wrapper: ReactWrapper;

const ComponentWrapper: React.FC<TimeseriesPreviewProps> = props => (
  <ClientSDKProvider client={sdk}>
    <TimeseriesPreview {...props} />
  </ClientSDKProvider>
);

beforeEach(() => {
  wrapper = new ReactWrapper(<div />);
  sdk.timeseries.retrieve.mockResolvedValue([singleTimeseries]);
  sdk.datapoints.retrieveLatest.mockResolvedValue([
    randomLatestDatapoint(41852231325889),
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  wrapper.unmount();
});

describe('TimeseriesChart', () => {
  it('renders correctly when ids are specified', async () => {
    await act(async () => {
      wrapper = mount(<ComponentWrapper {...defaultProps} />);
    });

    expect(wrapper.exists()).toBeTruthy();
  });
  it('should trigger callback if provided', async () => {
    const onToggleVisibility = jest.fn();

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper {...{ ...defaultProps, onToggleVisibility }} />
      );
    });

    wrapper.update();

    const btn = wrapper.find('Icon[data-test-id="visibility"]');

    btn.simulate('click');

    expect(onToggleVisibility).toHaveBeenCalled();
  });
  it('should display provided value', async () => {
    const formatValue = (prop?: number | string): string | number =>
      `${Number(prop)} psi`;
    const timestamp = new Date();
    const value = 32;
    const valueToDisplay = { value, timestamp };
    const dateFormat = 'DD MMM';
    const expectDateString = moment(timestamp).format(dateFormat);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          {...{
            ...defaultProps,
            valueToDisplay,
            dateFormat,
            formatDisplayValue: formatValue,
          }}
        />
      );
    });

    wrapper.update();

    const valueElement = wrapper.find('div[data-test-id="value"] span').at(0);
    const dateElement = wrapper.find('div[data-test-id="value"] span').at(1);

    expect(valueElement.text()).toEqual(`${value} psi`);
    expect(dateElement.text()).toEqual(expectDateString);
  });
  it('should display dropdown menu', async () => {
    const options = {
      edit: 'Edit item',
      emphasize: 'Emphasize',
      remove: 'Remove',
    };
    const onClick = jest.fn();
    const dropdown: TimeseriesPreviewMenuConfig = {
      options,
      onClick,
    };

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          {...{
            ...defaultProps,
            dropdown,
          }}
        />
      );
    });

    wrapper.update();

    const dropdownElement = wrapper.find(Dropdown);

    expect(dropdownElement.exists()).toBeTruthy();

    dropdownElement.simulate('click');
  });
  it('should call provided fetching methods', async () => {
    jest.useFakeTimers();

    const timestamp = new Date();
    const value = 32;
    const valueToDisplay = { value, timestamp };
    const retrieveTimeseries = jest
      .fn()
      .mockReturnValue(Promise.resolve(singleTimeseries));
    const retrieveLatestDatapoint = jest
      .fn()
      .mockReturnValue(Promise.resolve(randomLatestDatapoint(0)));
    const updateInterval = 1000;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          {...{
            ...defaultProps,
            retrieveTimeseries,
            retrieveLatestDatapoint,
            updateInterval,
          }}
        />
      );
    });

    wrapper.update();

    expect(retrieveTimeseries).toHaveBeenCalled();
    expect(retrieveLatestDatapoint).toHaveBeenCalledTimes(1);

    jest.runOnlyPendingTimers();

    expect(retrieveLatestDatapoint).toHaveBeenCalledTimes(2);

    await act(async () => {
      return new Promise<void>(resolve =>
        wrapper.setProps({ valueToDisplay }, resolve)
      );
    });

    jest.runOnlyPendingTimers();

    expect(retrieveLatestDatapoint).toHaveBeenCalledTimes(2);

    await act(async () => {
      return new Promise<void>(resolve =>
        wrapper.setProps({ valueToDisplay: undefined }, resolve)
      );
    });

    expect(retrieveLatestDatapoint).toHaveBeenCalledTimes(3);

    jest.runOnlyPendingTimers();

    expect(retrieveLatestDatapoint).toHaveBeenCalledTimes(4);
  });
});
