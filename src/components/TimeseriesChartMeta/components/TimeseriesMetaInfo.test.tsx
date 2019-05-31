import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesList } from '../../../mocks';
import { TimeseriesMetaInfo } from './TimeseriesMetaInfo';

configure({ adapter: new Adapter() });

sdk.Datapoints.retrieveLatest = jest.fn();

const timeseries = timeseriesList[0];

describe('TimeseriesMetaInfo', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(
      <TimeseriesMetaInfo
        metaInfo={timeseries.metadata!}
      />
    );
    expect(wrapper.find(TimeseriesMetaInfo)).toHaveLength(1);
  });

  it('Should expand after click', () => {
    const wrapper = mount(
      <TimeseriesMetaInfo
        metaInfo={timeseries.metadata!}
      />
    );

    const header = wrapper.find('div.ant-collapse-header');
    expect(header).toHaveLength(1);
    header.simulate('click');
    wrapper.update();
    expect(wrapper.text()).toContain(Object.keys(timeseries.metadata!)[0]);
  });

});
