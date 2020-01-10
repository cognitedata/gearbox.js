import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { timeseriesListV2 } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { DraggableBox, Link, Tag } from './DraggableBox';

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

const propsCallbacks = {
  onClick: jest.fn(),
  onLinkClick: jest.fn(),
  onSettingsClick: jest.fn(),
  onDragHandleDoubleClick: jest.fn(),
};

const testTimeserie = timeseriesListV2[0];
const containerSize = {
  width: 1000,
  height: 500,
};

beforeEach(() => {
  sdk.timeseries.retrieve.mockResolvedValue([testTimeserie]);
  sdk.datapoints.retrieveLatest.mockResolvedValue([
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
  sdk.timeseries.retrieve.mockClear();
  sdk.datapoints.retrieveLatest.mockClear();
});

describe('SensorOverlay - DraggableBox', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
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
      <ClientSDKProvider client={sdk}>
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

  it('Should show/hide tooltips on mouse over/leave', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
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
      </ClientSDKProvider>
    );

    setImmediate(() => {
      // need to wait because the component fetches data
      wrapper.update();
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
      <ClientSDKProvider client={sdk}>
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
      <ClientSDKProvider client={sdk}>
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
      const alertParagraph = wrapper.find('div[data-test-id="tag-error"]');
      expect(alertParagraph).toHaveLength(1);
      expect(alertParagraph.text()).toEqual('400.00% over the set limit of 10');
      done();
    });
  });
});
