import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesList } from '../../mocks';
import { DraggableBox, Link, Tag } from './DraggableBox';

configure({ adapter: new Adapter() });

sdk.TimeSeries.retrieve = jest.fn();
sdk.Datapoints.retrieveLatest = jest.fn();

const propsCallbacks = {
  onClick: jest.fn(),
  onLinkClick: jest.fn(),
  onSettingsClick: jest.fn(),
  onDragHandleDoubleClick: jest.fn(),
};

const testTimeserie = timeseriesList[0];
const containerSize = {
  width: 1000,
  height: 500,
};

beforeEach(() => {
  // @ts-ignore
  sdk.TimeSeries.retrieve.mockResolvedValue(testTimeserie);
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockResolvedValue({
    timestamp: Date.now(),
    value: 50.0,
  });
});

afterEach(() => {
  // @ts-ignore
  sdk.TimeSeries.retrieve.mockClear();
  // @ts-ignore
  sdk.Datapoints.retrieveLatest.mockClear();
});

describe('SensorOverlay - DraggableBox', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggableBox
          id={testTimeserie.id}
          left={0.2 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          sticky={false}
          onLinkClick={propsCallbacks.onLinkClick}
          isDraggable={false}
          flipped={false}
          onDragHandleDoubleClick={propsCallbacks.onDragHandleDoubleClick}
          onClick={propsCallbacks.onClick}
          onSettingsClick={propsCallbacks.onSettingsClick}
          isDragging={false}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.exists()).toBe(true);
  });

  it('Should call callbacks on mouse events', () => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggableBox
          id={testTimeserie.id}
          left={0.2 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          sticky={false}
          onLinkClick={propsCallbacks.onLinkClick}
          isDraggable={true}
          flipped={false}
          onDragHandleDoubleClick={propsCallbacks.onDragHandleDoubleClick}
          onClick={propsCallbacks.onClick}
          onSettingsClick={propsCallbacks.onSettingsClick}
          isDragging={false}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );

    const tag = wrapper.find(Tag);
    expect(tag).toHaveLength(1);
    tag.simulate('click');
    expect(propsCallbacks.onClick).toHaveBeenCalled();

    const tagLink = wrapper.find(Link);
    expect(tagLink).toHaveLength(1);
    tagLink.simulate('click');
    expect(propsCallbacks.onLinkClick).toHaveBeenCalled();

    const settingsIcon = wrapper.find('Icon[type="setting"]');
    expect(settingsIcon).toHaveLength(1);
    settingsIcon.simulate('click');
    expect(propsCallbacks.onSettingsClick).toHaveBeenCalled();

    const dragHandle = tag.find('div').at(1);
    expect(dragHandle).toHaveLength(1);
    dragHandle.simulate('dblclick');
    expect(propsCallbacks.onDragHandleDoubleClick).toHaveBeenCalled();
  });

  it('Should show/hide tooltips on mouse over/leave', done => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggableBox
          id={testTimeserie.id}
          left={0.2 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          sticky={false}
          isDraggable={true}
          flipped={false}
          onDragHandleDoubleClick={propsCallbacks.onDragHandleDoubleClick}
          isDragging={false}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );

    setImmediate(() => {
      // need to wait because the component fetches data
      const tag = wrapper.find(Tag);
      tag.simulate('mouseover');

      let hovers = wrapper.find('div.hovering');
      expect(hovers).toHaveLength(2);

      tag.simulate('mouseleave');
      hovers = wrapper.find('div.hovering');
      expect(hovers).toHaveLength(0);

      done();
    });
  });

  it('Should render nothing while dragging', () => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggableBox
          id={testTimeserie.id}
          left={0.2 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          sticky={false}
          isDraggable={true}
          flipped={false}
          onDragHandleDoubleClick={propsCallbacks.onDragHandleDoubleClick}
          isDragging={true}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );

    const draggableBox = wrapper.find(DraggableBox);
    expect(draggableBox).toHaveLength(1);
    const innerDiv = draggableBox.find('div');
    expect(innerDiv).toHaveLength(0);
  });
});
