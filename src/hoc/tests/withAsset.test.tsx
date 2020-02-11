import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { FC } from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { fakeAsset } from '../../mocks';
import { MockCogniteClient } from '../../mocks';
import { WithAssetDataProps } from '../interfaces';
import { withAsset } from '../withAsset';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  assets: any = {
    retrieve: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('withAsset', () => {
  beforeEach(() => {
    sdk.assets.retrieve.mockResolvedValue([fakeAsset]);
  });

  afterEach(() => {
    sdk.assets.retrieve.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAsset(TestComponent);
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

  it('Wrapped component should receive asset data after loading', done => {
    const TestComponent: FC<WithAssetDataProps> = props => (
      <div>
        <p className="name">{props.asset.name}</p>
        <p className="description">{props.asset.description}</p>
      </div>
    );
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.name').text()).toEqual(fakeAsset.name);
      expect(wrapper.find('p.description').text()).toEqual(
        fakeAsset.description
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.setProps({
      children: <WrappedComponent assetId={1234} />,
    });

    setImmediate(() => {
      expect(sdk.assets.retrieve).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAsset(TestComponent);
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
});
