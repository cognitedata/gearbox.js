import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import lodash from 'lodash';
import React from 'react';
import { datapointsList, timeseriesList } from '../../mocks';
import { TimeseriesChart } from './TimeseriesChart';

configure({ adapter: new Adapter() });

sdk.TimeSeries.retrieve = jest.fn();
sdk.Datapoints.retrieve = jest.fn();

// ignore debounce
jest.spyOn(lodash, 'debounce').mockImplementation((f: any) => {
  return f;
});

beforeEach(() => {
  // @ts-ignore
  sdk.TimeSeries.retrieve.mockResolvedValue(timeseriesList[0]);
  // @ts-ignore
  sdk.Datapoints.retrieve.mockResolvedValue(datapointsList);
});

// tslint:disable:no-big-function
describe('TimeseriesChart', () => {
  it('renders correctly', done => {
    const props = {
      timeseriesIds: [timeseriesList[0].id],
    };
    const wrapper = mount(<TimeseriesChart {...props} />);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('.linechart-container').exists()).toBeTruthy();
      jest.clearAllMocks();
      done();
    }, 0);
  });

  it('calls the sdk', done => {
    const id = 123;
    const props = {
      timeseriesIds: [id],
    };
    const wrapper = mount(<TimeseriesChart {...props} />);
    setTimeout(() => {
      wrapper.update();
      expect(sdk.TimeSeries.retrieve).toHaveBeenCalledTimes(1);
      expect(sdk.TimeSeries.retrieve).toHaveBeenCalledWith(id);
      expect(sdk.Datapoints.retrieve).toHaveBeenCalledTimes(1);
      expect(sdk.Datapoints.retrieve).toHaveBeenCalledWith(
        id,
        expect.anything()
      );
      jest.clearAllMocks();
      done();
    }, 0);
  });

  it('renders context chart', done => {
    const props = {
      timeseriesIds: [timeseriesList[0].id],
      contextChart: true,
    };
    const wrapper = mount(<TimeseriesChart {...props} />);
    // tslint:disable-next-line: no-identical-functions
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('.context-container').exists()).toBeTruthy();
      jest.clearAllMocks();
      done();
    }, 0);
  });
});
