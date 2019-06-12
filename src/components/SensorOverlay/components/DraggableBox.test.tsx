import { API } from '@cognite/sdk-alpha/dist/src/resources/api';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { fakeTimeseries } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DraggableBox, Link, Tag } from './DraggableBox';

configure({ adapter: new Adapter() });

const fakeClient: API = {
  // @ts-ignore
  timeseries: {
    retrieve: jest.fn(),
  },
  // @ts-ignore
  datapoints: {
    retrieveLatest: jest.fn(),
  },
};

const propsCallbacks = {
  onClick: jest.fn(),
  onLinkClick: jest.fn(),
  onSettingsClick: jest.fn(),
  onDragHandleDoubleClick: jest.fn(),
};

const testTimeserie = fakeTimeseries[0];
const containerSize = {
  width: 1000,
  height: 500,
};

beforeEach(() => {
  // @ts-ignore
  fakeClient.timeseries.retrieve.mockResolvedValue(testTimeserie);
  // @ts-ignore
  fakeClient.datapoints.retrieveLatest.mockResolvedValue([
    {
      id: 1,
      isString: false,
      datapoints: [
        {
          timestamp: new Date(),
          value: 50.0,
        },
      ],
    },
  ]);
});

afterEach(() => {
  // @ts-ignore
  fakeClient.timeseries.retrieve.mockClear();
  // @ts-ignore
  fakeClient.datapoints.retrieveLatest.mockClear();
});

describe('SensorOverlay - DraggableBox', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
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
      </ClientSDKProvider>
    );
    expect(wrapper).toHaveLength(1);
    expect(wrapper.exists()).toBe(true);
  });

  it('Should call callbacks on mouse events', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
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
      </ClientSDKProvider>
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

    wrapper.unmount();
  });

  fit('Should show/hide tooltips on mouse over/leave', done => {
    const wrapper = mount(
      <div
        style={{
          position: 'relative',
          ...containerSize,
        }}
      >
        <ClientSDKProvider client={fakeClient}>
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
        </ClientSDKProvider>
      </div>
    );

    setImmediate(() => {
      // need to wait because the component fetches data
      wrapper.update();
      const tag = wrapper.find(Tag);
      console.log('tag', tag.debug());
      // expect(Tag).toHaveLength(1);
      tag.simulate('mouseover');
      wrapper.update();

      let hovers = wrapper.find('div.hovering');
      expect(hovers).toHaveLength(2);

      tag.simulate('mouseleave');
      wrapper.update();
      hovers = wrapper.find('div.hovering');
      expect(hovers).toHaveLength(0);

      done();
    });
  });

  it('Should render nothing while dragging', () => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
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
      </ClientSDKProvider>
    );

    const draggableBox = wrapper.find(DraggableBox);
    expect(draggableBox).toHaveLength(1);
    const innerDiv = draggableBox.find('div');
    expect(innerDiv).toHaveLength(0);
  });

  it('Should render min-max alert', done => {
    const wrapper = mount(
      <ClientSDKProvider client={fakeClient}>
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
            sticky={true}
            isDraggable={true}
            flipped={false}
            onDragHandleDoubleClick={propsCallbacks.onDragHandleDoubleClick}
            isDragging={false}
            connectDragSource={(v: any) => v}
            connectDragPreview={(v: any) => v}
            minMaxRange={{ min: 0, max: 10 }}
          />
        </div>
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      const alertParagraph = wrapper.find('p');
      expect(alertParagraph).toHaveLength(1);
      expect(alertParagraph.text()).toEqual('400.00% over the set limit of 10');
      done();
    });
  });
});
