import React from 'react';
import { mount, configure } from 'enzyme';
import * as sdk from '@cognite/sdk';
import { DragDropContext } from 'react-dnd';
import { timeseriesList } from 'mocks/timeseriesList';
import DNDTestBackend from 'react-dnd-test-backend';
import Adapter from 'enzyme-adapter-react-16';
import sizeMe from 'react-sizeme';
import OriginalSensorOverlay from './SensorOverlay';
import { DraggableBox, Tag } from './DraggableBox';
import { DraggablePoint } from './DraggablePoint';
import SvgLine from './SvgLine';

sizeMe.noPlaceholders = true;

configure({ adapter: new Adapter() });

const SensorOverlay = DragDropContext(DNDTestBackend)(
  OriginalSensorOverlay.DecoratedComponent
);

sdk.TimeSeries.retrieve = jest.fn();
sdk.Datapoints.retrieveLatest = jest.fn();

const propsCallbacks = {
  onClick: jest.fn(),
  onLinkClick: jest.fn(),
  onSettingClick: jest.fn(),
  onSensorPositionChange: jest.fn(),
};

beforeEach(() => {
  // @ts-ignore
  sdk.TimeSeries.retrieve.mockResolvedValue(timeseriesList[0]);
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockResolvedValue({
    timestamp: Date.now(),
    value: 50.0,
  });
});

afterEach(() => {
  propsCallbacks.onClick.mockClear();
  propsCallbacks.onLinkClick.mockClear();
  propsCallbacks.onSettingClick.mockClear();
  propsCallbacks.onSensorPositionChange.mockClear();
});

describe('SensorOverlay', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[8681821313339919]}
        size={{ width: 1000, height: 500 }}
      />
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.exists()).toBe(true);
  });

  it('Includes all required components', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[8681821313339919]}
        size={{ width: 1000, height: 500 }}
      >
        <div style={{ width: 1000, height: 500 }} />
      </SensorOverlay>
    );

    const draggableBox = wrapper.find(DraggableBox);
    expect(draggableBox).toHaveLength(1);

    const draggablePoint = wrapper.find(DraggablePoint);
    expect(draggablePoint).toHaveLength(1);

    const svgLine = wrapper.find(SvgLine);
    expect(svgLine).toHaveLength(1);
  });

  it('Calls callbacks on mouse events', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[8681821313339919]}
        linksMap={{ '8681821313339919': true }}
        onClick={propsCallbacks.onClick}
        onLinkClick={propsCallbacks.onLinkClick}
        onSettingsClick={propsCallbacks.onSettingClick}
        onSensorPositionChange={propsCallbacks.onSensorPositionChange}
        size={{ width: 1000, height: 500 }}
      >
        <div style={{ width: 1000, height: 500 }} />
      </SensorOverlay>
    );

    const tag = wrapper.find(Tag);
    expect(tag).toHaveLength(1);

    tag.simulate('click');
    expect(propsCallbacks.onClick).toHaveBeenCalled();

    const settingsIcon = tag.find('svg[data-icon="setting"]');
    expect(settingsIcon).toHaveLength(1);

    settingsIcon.simulate('click');
    expect(propsCallbacks.onSettingClick).toHaveBeenCalled();

    const link = tag.find('a');
    expect(link).toHaveLength(1);

    link.simulate('click');
    expect(propsCallbacks.onLinkClick).toHaveBeenCalled();

    const pointer = wrapper.find(DraggablePoint).find('div');
    expect(pointer).toHaveLength(1);

    pointer.simulate('click');
    expect(propsCallbacks.onClick).toHaveBeenCalledTimes(2);

    pointer.simulate('dblclick');
    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalled();
  });

  it('Tag and pointer should be draggable', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[8681821313339919]}
        linksMap={{ '8681821313339919': true }}
        onClick={propsCallbacks.onClick}
        onSensorPositionChange={propsCallbacks.onSensorPositionChange}
        size={{ width: 1000, height: 500 }}
      >
        <div style={{ width: 1000, height: 500 }} />
      </SensorOverlay>
    );
    // @ts-ignore
    const backend = wrapper.instance().getManager().getBackend() as DNDTestBackend;
    const dragSourceBox = wrapper.find('DragSource(DraggableBox)');
    const dragSourcePoint = wrapper.find('DragSource(DraggablePoint)');
    const dragTarget = wrapper.find('DropTarget(SensorOverlay)');
    expect(dragSourceBox).toHaveLength(1);
    expect(dragSourcePoint).toHaveLength(1);
    expect(dragTarget).toHaveLength(1);
    // @ts-ignore
    const boxHandlerId = dragSourceBox.instance().getHandlerId();
    // @ts-ignore
    const pointHandlerId = dragSourceBox.instance().getHandlerId();
    // @ts-ignore
    const targetHandlerId = dragTarget.instance().getHandlerId();
    /**
     * Simulate tag/box drag and drop
     */
    backend.simulateBeginDrag([boxHandlerId]);
    backend.simulateHover([targetHandlerId])
    backend.simulateDrop();
    backend.simulateEndDrag();
    /**
     * Simulate pointer drag and drop
     */
    backend.simulateBeginDrag([pointHandlerId]);
    backend.simulateHover([targetHandlerId])
    backend.simulateDrop();
    backend.simulateEndDrag();
    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalledTimes(2);
  });
});
