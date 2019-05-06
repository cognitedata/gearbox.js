import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { EVENTS } from '../../mocks';
import { EventPreview } from './EventPreview';

configure({ adapter: new Adapter() });

// @ts-ignore
sdk.Events.retrieve = jest.fn();

beforeEach(() => {
  // @ts-ignore
  sdk.Events.retrieve.mockClear();
  // @ts-ignore
  sdk.Events.retrieve.mockImplementation(
    async (eventId: number): Promise<sdk.Event> => {
      return EVENTS.find(e => e.id === eventId) as sdk.Event;
    }
  );
});

describe('EventPreview', () => {
  it('Should render without exploding', done => {
    const wrapper = mount(<EventPreview eventId={8825861064387} />);
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(EventPreview)).toHaveLength(1);
      done();
    });
  });

  it('Should render loading spinner', () => {
    const wrapper = mount(<EventPreview eventId={8825861064387} />);
    expect(wrapper.find('.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
  });

  it('Should render nothing if loading spinner is hidden', () => {
    const wrapper = mount(
      <EventPreview eventId={8825861064387} hideLoadingSpinner={true} />
    );
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('Should request an event via SDK if eventId has been changed', done => {
    const wrapper = mount(<EventPreview eventId={8825861064387} />);
    expect(sdk.Events.retrieve).toBeCalledTimes(1);
    wrapper.setProps({ eventId: 1995162693488 });
    setImmediate(() => {
      expect(sdk.Events.retrieve).toBeCalledTimes(2);
      done();
    });
  });

  it('Should trigger callback when user clicks on the details button', done => {
    const onDetailsClick = jest.fn();
    const wrapper = mount(
      <EventPreview eventId={8825861064387} onShowDetails={onDetailsClick} />
    );
    setImmediate(() => {
      wrapper.update();
      const button = wrapper.find('button');
      button.simulate('click');
      expect(onDetailsClick).toBeCalled();
      done();
    });
  });
});
