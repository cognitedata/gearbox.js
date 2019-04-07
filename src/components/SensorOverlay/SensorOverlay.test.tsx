import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SensorOverlay from './SensorOverlay';
import SensorTag, { Tag } from './SensorTag';
import EventLabel, { TagValue, Tag as EventTag } from './EventLabel';
import StyledOdometer from './StyledOdometer';
import {
  eventNames,
  eventConstants,
  eventPositions,
  sensorConstants,
  sensorTagPositions,
  sensorValues,
  timeseriesNames,
} from './SensorOverlayTestData';
import Mock = jest.Mock;

configure({ adapter: new Adapter() });

const propsCallbacks: { [name: string]: Mock } = {
  onClick: jest.fn(),
  onSettingsClick: jest.fn(),
};

describe('SensorOverlay', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <SensorOverlay
        timeseriesNames={timeseriesNames}
        sensorTagPositions={sensorTagPositions}
        sensorConstants={sensorConstants}
        sensorValues={sensorValues}
      />
    );
    expect(wrapper).toHaveLength(1);
    const sensorTags = wrapper.find(SensorTag);
    expect(sensorTags).toHaveLength(3);
  });

  it('Should call callback on tag, settings and event label clicks', () => {
    const { onClick, onSettingsClick } = propsCallbacks;

    const wrapper = mount(
      <SensorOverlay
        timeseriesNames={timeseriesNames}
        sensorTagPositions={sensorTagPositions}
        sensorConstants={sensorConstants}
        sensorValues={sensorValues}
        eventNames={eventNames}
        eventPositions={eventPositions}
        eventConstants={eventConstants}
        onClick={onClick}
        onSettingsClick={onSettingsClick}
      />
    );
    const sensorTags = wrapper.find(SensorTag);
    const firstTag = sensorTags.first();
    const styledOdometer = firstTag.find(StyledOdometer);
    styledOdometer.simulate('click');
    expect(onClick).toHaveBeenCalled();
    const settingIcon = firstTag.find('.anticon-setting');
    settingIcon.simulate('click');
    expect(onSettingsClick).toHaveBeenCalled();
    onClick.mockClear();
    const eventLabels = wrapper.find(TagValue);
    expect(eventLabels).toHaveLength(3);
    eventLabels.first().simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('SensorTag should have correct hovering state on mouse over and mouse leave', () => {
    const wrapper = mount(
      <SensorOverlay
        timeseriesNames={timeseriesNames}
        sensorTagPositions={sensorTagPositions}
        sensorConstants={sensorConstants}
        sensorValues={sensorValues}
        eventNames={eventNames}
        eventPositions={eventPositions}
        eventConstants={eventConstants}
      />
    );
    const sensorTags = wrapper.find(SensorTag);
    const firstTag = sensorTags.first();
    const innerTag = firstTag.find(Tag);
    innerTag.simulate('mouseover');
    expect(firstTag.state('hovering')).toBe(true);
    innerTag.simulate('mouseleave');
    expect(firstTag.state('hovering')).toBe(false);
  });

  it('EventLabel should have correct hovering state on mouse over and mouse leave', () => {
    const wrapper = mount(
      <SensorOverlay
        timeseriesNames={timeseriesNames}
        sensorTagPositions={sensorTagPositions}
        sensorConstants={sensorConstants}
        sensorValues={sensorValues}
        eventNames={eventNames}
        eventPositions={eventPositions}
        eventConstants={eventConstants}
      />
    );
    const eventLabels = wrapper.find(EventLabel);
    const firstEventLabel = eventLabels.first();
    const eventTag = firstEventLabel.find(EventTag);
    eventTag.simulate('mouseover');
    expect(firstEventLabel.state('hovering')).toBe(true);
    eventTag.simulate('mouseleave');
    expect(firstEventLabel.state('hovering')).toBe(false);
  });
});
