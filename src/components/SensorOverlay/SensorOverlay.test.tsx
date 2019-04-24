import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { DragDropContext } from 'react-dnd';
import DNDTestBackend from 'react-dnd-test-backend';
import sizeMe from 'react-sizeme';
import sinon from 'sinon';
import { timeseriesList } from '../../mocks';
import { DraggableBox, Tag } from './components/DraggableBox';
import { DraggablePoint } from './components/DraggablePoint';
import SvgLine from './components/SvgLine';
import { SensorOverlay as OriginalSensorOverlay } from './SensorOverlay';

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
  sdk.TimeSeries.retrieve.mockImplementation((id: number) => {
    return Promise.resolve(timeseriesList.find(ts => ts.id === id));
  });
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockImplementation(() => {
    return Promise.resolve({
      timestamp: Date.now(),
      value: 50.0,
    });
  });
});

afterEach(() => {
  propsCallbacks.onClick.mockClear();
  propsCallbacks.onLinkClick.mockClear();
  propsCallbacks.onSettingClick.mockClear();
  propsCallbacks.onSensorPositionChange.mockClear();
});
// tslint:disable:no-big-function
describe('SensorOverlay', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 500 }}
      />
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.exists()).toBe(true);
  });

  it('Includes all required components', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
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
        timeserieIds={[timeseriesList[0].id]}
        linksMap={{ [timeseriesList[0].id]: true }}
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

    const pointer = wrapper.find(DraggablePoint);
    expect(pointer).toHaveLength(1);

    pointer.simulate('click');
    expect(propsCallbacks.onClick).toHaveBeenCalledTimes(2);

    pointer.simulate('dblclick');
    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalled();

    const boxHandle = tag.find('div').at(1);
    boxHandle.simulate('dblclick');
    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalledTimes(2);
  });

  it('Tag and pointer should be draggable', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        linksMap={{ [timeseriesList[0].id]: true }}
        onClick={propsCallbacks.onClick}
        onSensorPositionChange={propsCallbacks.onSensorPositionChange}
        size={{ width: 1000, height: 500 }}
      >
        <div style={{ width: 1000, height: 500 }} />
      </SensorOverlay>
    );

    // @ts-ignore
    const manager = wrapper.instance().getManager();
    const backend = manager.getBackend();
    const monitor = manager.getMonitor();
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
    // add mocks in monitor to simulate real offset
    sinon.stub(monitor, 'getInitialClientOffset').callsFake(() => ({
      x: 0,
      y: 0,
    }));
    sinon.stub(monitor, 'getDifferenceFromInitialOffset').callsFake(() => ({
      x: 100,
      y: 200,
    }));
    /**
     * Simulate tag/box drag and drop
     */
    backend.simulateBeginDrag([boxHandlerId]);
    backend.simulateHover([targetHandlerId]);
    backend.simulateDrop();
    backend.simulateEndDrag();
    /**
     * Simulate pointer drag and drop
     */
    backend.simulateBeginDrag([pointHandlerId]);
    backend.simulateHover([targetHandlerId]);
    backend.simulateDrop();
    backend.simulateEndDrag();
    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalledTimes(2);
  });

  it('Should render nothing if there is no space in container', () => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 0 }}
      />
    );

    const draggableBox = wrapper.find(DraggableBox);
    expect(draggableBox).toHaveLength(0);

    const draggablePoint = wrapper.find(DraggablePoint);
    expect(draggablePoint).toHaveLength(0);

    const svgLine = wrapper.find(SvgLine);
    expect(svgLine).toHaveLength(0);
  });

  it('Should render new sensors if they were added in props', done => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 500 }}
      />
    );

    wrapper.setProps(
      {
        timeserieIds: [timeseriesList[0].id, timeseriesList[1].id],
      },
      () => {
        const draggableBox = wrapper.find(DraggableBox);
        expect(draggableBox).toHaveLength(2);

        const draggablePoint = wrapper.find(DraggablePoint);
        expect(draggablePoint).toHaveLength(2);

        const svgLine = wrapper.find(SvgLine);
        expect(svgLine).toHaveLength(2);

        done();
      }
    );
  });

  it('Newly added sensor should have be shifted position and different color', done => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 500 }}
      />
    );

    wrapper.setProps(
      {
        timeserieIds: [timeseriesList[0].id, timeseriesList[1].id],
      },
      () => {
        const draggableBoxes = wrapper.find(DraggableBox);
        const draggablePoints = wrapper.find(DraggablePoint);

        const firstBox = draggableBoxes.at(0);
        const secondBox = draggableBoxes.at(1);

        const firstPoint = draggablePoints.at(0);
        const secondPoint = draggablePoints.at(1);

        expect(firstBox.prop('left')).not.toEqual(secondBox.prop('left'));
        expect(firstBox.prop('top')).not.toEqual(secondBox.prop('top'));
        expect(firstBox.prop('color')).not.toEqual(secondBox.prop('color'));

        expect(firstPoint.prop('left')).not.toEqual(secondPoint.prop('left'));
        expect(firstPoint.prop('top')).not.toEqual(secondPoint.prop('top'));
        expect(firstPoint.prop('color')).not.toEqual(secondPoint.prop('color'));

        done();
      }
    );
  });

  it('if first sensor has been dragged the next added one should appear in first default slot', done => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 500 }}
        onSensorPositionChange={propsCallbacks.onSensorPositionChange}
      >
        <div style={{ width: 1000, height: 500 }} />
      </SensorOverlay>
    );

    const firstBox = wrapper.find(DraggableBox);

    const firstDefaultSlot = {
      left: firstBox.prop('left'),
      top: firstBox.prop('top'),
    };

    // @ts-ignore
    const manager = wrapper.instance().getManager();
    const backend = manager.getBackend();

    const dragSourceBox = wrapper.find('DragSource(DraggableBox)');
    const dragTarget = wrapper.find('DropTarget(SensorOverlay)');
    expect(dragSourceBox).toHaveLength(1);
    expect(dragTarget).toHaveLength(1);
    // @ts-ignore
    const boxHandlerId = dragSourceBox.instance().getHandlerId();
    // @ts-ignore
    const targetHandlerId = dragTarget.instance().getHandlerId();
    backend.simulateBeginDrag([boxHandlerId]);
    backend.simulateHover([targetHandlerId]);
    backend.simulateDrop();
    backend.simulateEndDrag();

    expect(propsCallbacks.onSensorPositionChange).toHaveBeenCalled();

    wrapper.setProps(
      {
        timeserieIds: [timeseriesList[0].id, timeseriesList[1].id],
      },
      () => {
        const newSensor = wrapper
          .find(DraggableBox)
          .find({ id: timeseriesList[1].id });
        expect(newSensor).toHaveLength(1);

        expect(firstDefaultSlot.left).toEqual(newSensor.prop('left'));
        expect(firstDefaultSlot.top).toEqual(newSensor.prop('top'));

        done();
      }
    );
  });

  it('Sensor should change default color if a new color has been given in colorMap', done => {
    const wrapper = mount(
      <SensorOverlay
        timeserieIds={[timeseriesList[0].id]}
        size={{ width: 1000, height: 500 }}
      />
    );

    const draggableBox = wrapper.find(DraggableBox);
    const defaultColor = draggableBox.prop('color');

    wrapper.setProps(
      {
        timeserieIds: [timeseriesList[0].id],
        colorMap: {
          [timeseriesList[0].id]: 'magenta',
        },
      },
      () => {
        const updatedBox = wrapper.find(DraggableBox);
        const newColor = updatedBox.prop('color');
        expect(defaultColor).not.toEqual(newColor);
        done();
      }
    );
  });
});
