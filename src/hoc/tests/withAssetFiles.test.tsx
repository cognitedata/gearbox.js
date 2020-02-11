import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { FC } from 'react';
import { ClientSDKProvider } from '../../components/ClientSDKProvider';
import { SDK_LIST_LIMIT } from '../../constants/sdk';
import { fakeFiles } from '../../mocks';
import { MockCogniteClient } from '../../mocks';
import { WithAssetFilesDataProps } from '../interfaces';
import { withAssetFiles } from '../withAssetFiles';

configure({ adapter: new Adapter() });

class CogniteClient extends MockCogniteClient {
  files: any = {
    list: jest.fn(),
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

describe('withAssetFiles', () => {
  beforeEach(() => {
    sdk.files.list.mockReturnValue({
      autoPagingToArray: () => Promise.resolve(fakeFiles),
    });
  });

  afterEach(() => {
    sdk.files.list.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should render custom spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetFiles(TestComponent);
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

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetFiles(TestComponent);
    const loadHandler = jest.fn();
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} onAssetFilesLoaded={loadHandler} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      expect(loadHandler).toBeCalled();
      done();
    });
  });

  it('Wrapped component should receive asset files after loading', done => {
    const TestComponent: FC<WithAssetFilesDataProps> = props => (
      <div>
        <p className="files-number">{props.assetFiles.length}</p>
        <p className="first-file-name">{props.assetFiles[0].name}</p>
      </div>
    );
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.files-number').text()).toEqual(
        fakeFiles.length.toString()
      );
      expect(wrapper.find('p.first-file-name').text()).toEqual(
        fakeFiles[0].name
      );
      done();
    });
  });

  it('Should request for list of files if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />
      </ClientSDKProvider>
    );

    wrapper.setProps({
      children: <WrappedComponent assetId={1234} />,
    });

    setImmediate(() => {
      expect(sdk.files.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetFiles(TestComponent);
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
    const WrappedComponent = withAssetFiles(() => <div />);
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent
          assetId={123}
          queryParams={{
            limit: 78,
            filter: { assetIds: [34234], name: 'test name' },
          }}
        />
      </ClientSDKProvider>
    );

    expect(sdk.files.list).toBeCalledWith({
      limit: 78,
      filter: { assetIds: [123], name: 'test name' },
    });
  });

  it('Should call sdkClient.files.list with default limit', () => {
    const WrappedComponent = withAssetFiles(() => <div />);
    mount(
      <ClientSDKProvider client={sdk}>
        <WrappedComponent assetId={123} />\
      </ClientSDKProvider>
    );

    expect(sdk.files.list).toBeCalledWith({
      limit: SDK_LIST_LIMIT,
      filter: { assetIds: [123] },
    });
  });
});
