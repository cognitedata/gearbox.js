import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { ASSET_DATA } from '../../mocks';
import { withAsset, WithAssetDataProps } from '../withAsset';

configure({ adapter: new Adapter() });

sdk.Assets.retrieve = jest.fn();

describe('withAsset', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Assets.retrieve.mockResolvedValue(ASSET_DATA);
  });

  afterEach(() => {
    // @ts-ignore
    sdk.Assets.retrieve.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(
      <WrappedComponent
        assetId={123}
        customSpinner={<div className="my-custom-spinner" />}
      />
    );
    expect(wrapper.find('div.my-custom-spinner')).toHaveLength(1);
  });

  it('Wrapped component should receive asset data after loading', done => {
    const TestComponent: React.SFC<WithAssetDataProps> = props => (
      <div>
        <p className="name">{props.asset.name}</p>
        <p className="description">{props.asset.description}</p>
      </div>
    );
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.name').text()).toEqual(ASSET_DATA.name);
      expect(wrapper.find('p.description').text()).toEqual(
        ASSET_DATA.description
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAsset(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.setProps({ assetId: 1234 });

    setImmediate(() => {
      expect(sdk.Assets.retrieve).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAsset(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
