import { configure, mount } from 'enzyme';
import EventTimeline from './EventTimeline';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { generateEventTimelineData, eventTimelineDataSrc } from 'mocks/events';

const data = eventTimelineDataSrc.map(event =>
  // @ts-ignore – reason – support of spread operator in tslint
  generateEventTimelineData(...event)
);

configure({ adapter: new Adapter() });

describe('EventTimeline', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<EventTimeline />);
    expect(wrapper.exists()).toBeTruthy();

    wrapper.unmount();
  });

  it('Check "createChart" call after component mount and update', () => {
    const dataInput = data.concat(data);
    const wrapper = mount(<EventTimeline data={data} />);
    const instance = wrapper.instance() as EventTimeline;
    const createChart = jest.spyOn(instance, 'createChart');

    instance.forceUpdate();

    instance.componentDidMount();
    expect(createChart).toHaveBeenCalledTimes(1);

    wrapper.setProps({ data: dataInput });
    expect(createChart).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });
});
