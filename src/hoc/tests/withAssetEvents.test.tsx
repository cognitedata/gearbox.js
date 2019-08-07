import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { SDK_LIST_LIMIT } from '../../constants/sdk';
import { fakeEvents } from '../../mocks';

import { withAssetEvents, WithAssetEventsDataProps } from '../withAssetEvents';

configure({ adapter: new Adapter() });

const fakeClient: CogniteClient = {
  // @ts-ignore
  events: {
    list: jest.fn(),
  },
};

jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('withAssetEvents', () => {
  beforeEach(() => {
    // @ts-ignore
    fakeClient.events.list.mockReturnValue({
      autoPagingToArray: () => Promise.resolve(fakeEvents),
    });
  });

  afterEach(() => {
    // @ts-ignore
    fakeClient.events.list.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const loadHandler = jest.fn();
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} onAssetEventsLoaded={loadHandler} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      expect(loadHandler).toBeCalled();
      done();
    });
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent
          assetId={123}
          customSpinner={<div className="my-custom-spinner" />}
        />
      </ClientSDKProvider>
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Wrapped component should receive asset events after loading', done => {
    const TestComponent: React.SFC<WithAssetEventsDataProps> = props => (
      <div>
        <p className="events-number">{props.assetEvents.length}</p>
        <p className="first-event-description">
          {props.assetEvents[0].description}
        </p>
      </div>
    );
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.events-number').text()).toEqual(
        fakeEvents.length.toString()
      );
      expect(wrapper.find('p.first-event-description').text()).toEqual(
        fakeEvents[0].description
      );
      done();
    });
  });

  it('Should request list of events if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.setProps({ children: <WrappedComponent assetId={1234} /> });

    setImmediate(() => {
      expect(fakeClient.events.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetEvents(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });

  it('Should merge query params with assetId', () => {
    const WrappedComponent = withAssetEvents(() => <div />);
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent
          assetId={123}
          queryParams={{ limit: 78, filter: { startTime: { min: 1, max: 2 } } }}
        />
      </ClientSDKProvider>
    );

    expect(fakeClient.events.list).toBeCalledWith({
      limit: 78,
      filter: {
        assetIds: [123],
        startTime: { min: 1, max: 2 },
      },
    });
  });

  it('Should call sdkClient.events.list with default limit', () => {
    const WrappedComponent = withAssetEvents(() => <div />);
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(fakeClient.events.list).toBeCalledWith({
      limit: SDK_LIST_LIMIT,
      filter: {
        assetIds: [123],
      },
    });
  });
});
