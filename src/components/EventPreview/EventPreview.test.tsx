import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { fakeEvents } from '../../mocks';
import { MockCogniteClient } from '../../utils/mockSdk';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { EventPreview } from './EventPreview';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  events: any = {
    retrieve: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

beforeEach(() => {
  sdk.events.retrieve.mockClear();
  sdk.events.retrieve.mockImplementation(async (ids: { id: number }[]) => {
    return [fakeEvents.find(e => e.id === ids[0].id)];
  });
});

describe('EventPreview', () => {
  it('Should render without exploding', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <EventPreview eventId={8825861064387} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(EventPreview)).toHaveLength(1);
      done();
    });
  });

  it('Should render loading spinner', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <EventPreview eventId={8825861064387} />
      </ClientSDKProvider>
    );
    expect(wrapper.find('.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
  });

  it('Should render nothing if loading spinner is hidden', () => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <EventPreview eventId={8825861064387} hideLoadingSpinner={true} />
      </ClientSDKProvider>
    );
    expect(wrapper.isEmptyRender()).toBeTruthy();
  });

  it('Should request an event via SDK if eventId has been changed', done => {
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <EventPreview eventId={8825861064387} />
      </ClientSDKProvider>
    );
    expect(sdk.events.retrieve).toBeCalledTimes(1);
    wrapper.setProps({ children: <EventPreview eventId={1995162693488} /> });
    setImmediate(() => {
      expect(sdk.events.retrieve).toBeCalledTimes(2);
      done();
    });
  });

  it('Should trigger callback when user clicks on the details button', done => {
    const onDetailsClick = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <EventPreview eventId={8825861064387} onShowDetails={onDetailsClick} />
      </ClientSDKProvider>
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
