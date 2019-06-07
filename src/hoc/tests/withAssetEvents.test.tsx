import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { SDK_LIST_LIMIT } from '../../constants/sdk';
import { EVENTS } from '../../mocks';
import { withAssetEvents, WithAssetEventsDataProps } from '../withAssetEvents';

configure({ adapter: new Adapter() });

sdk.Events.list = jest.fn();

describe('withAssetEvents', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Events.list.mockResolvedValue({ items: EVENTS });
  });

  afterEach(() => {
    // @ts-ignore
    sdk.Events.list.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const loadHandler = jest.fn();
    mount(<WrappedComponent assetId={123} onAssetEventsLoaded={loadHandler} />);

    setImmediate(() => {
      expect(loadHandler).toBeCalled();
      done();
    });
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(
      <WrappedComponent
        assetId={123}
        customSpinner={<div className="my-custom-spinner" />}
      />
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Wrapped component should receive asset events  after loading', done => {
    const TestComponent: React.SFC<WithAssetEventsDataProps> = props => (
      <div>
        <p className="events-number">{props.assetEvents.length}</p>
        <p className="first-event-description">
          {props.assetEvents[0].description}
        </p>
      </div>
    );
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.events-number').text()).toEqual(
        EVENTS.length.toString()
      );
      expect(wrapper.find('p.first-event-description').text()).toEqual(
        EVENTS[0].description
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetEvents(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.setProps({ assetId: 1234 });

    setImmediate(() => {
      expect(sdk.Events.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetEvents(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });

  it('Should merge query params with assetId', () => {
    const WrappedComponent = withAssetEvents(() => <div />);
    mount(
      <WrappedComponent
        assetId={123}
        queryParams={{ limit: 78, sort: 'sort option' }}
      />
    );

    expect(sdk.Events.list).toBeCalledWith({
      assetId: 123,
      limit: 78,
      sort: 'sort option',
    });
  });

  it('Should call sdk.Events.list with default limit', () => {
    const WrappedComponent = withAssetEvents(() => <div />);
    mount(<WrappedComponent assetId={123} />);

    expect(sdk.Events.list).toBeCalledWith({
      assetId: 123,
      limit: SDK_LIST_LIMIT,
    });
  });
});
