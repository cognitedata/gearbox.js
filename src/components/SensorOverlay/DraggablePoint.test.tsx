import React from 'react';
import { mount, configure } from 'enzyme';
import { DraggablePoint } from './DraggablePoint';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const propsCallbacks = {
  onClick: jest.fn(),
  onPointDoubleClick: jest.fn(),
};

const containerSize = {
  width: 1000,
  height: 500,
};

describe('SensorOverlay - DraggablePoint', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggablePoint
          id={123}
          left={0.4 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          isDraggable={true}
          onClick={propsCallbacks.onClick}
          onDragHandleDoubleClick={propsCallbacks.onPointDoubleClick}
          isDragging={false}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.exists()).toBe(true);

    const svgs = wrapper.find('svg');
    expect(svgs).toHaveLength(1);
  });

  it('Should call callbacks on mouse events', () => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <DraggablePoint
          id={123}
          left={0.4 * containerSize.width}
          top={0.2 * containerSize.height}
          color={'green'}
          isDraggable={true}
          onClick={propsCallbacks.onClick}
          onDragHandleDoubleClick={propsCallbacks.onPointDoubleClick}
          isDragging={false}
          connectDragSource={(v: any) => v}
          connectDragPreview={(v: any) => v}
        />
      </div>
    );

    const point = wrapper.find('div').at(1);
    expect(point).toHaveLength(1);
    point.simulate('click');
    expect(propsCallbacks.onClick).toHaveBeenCalled();

    point.simulate('dblclick');
    expect(propsCallbacks.onPointDoubleClick).toHaveBeenCalled();
  });
});
