import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { EVENTS } from '../../mocks';
import { EventPreview } from './EventPreview';

// @ts-ignore
sdk.Events.retrieve = jest.fn();

configure({ adapter: new Adapter() });

beforeEach(() => {
  // @ts-ignore
  sdk.Events.retrieve.mockImplementation(
    async (eventId: number): Promise<sdk.Event> => {
      // @ts-ignore
      return EVENTS.find(e => e.id === eventId);
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
});
