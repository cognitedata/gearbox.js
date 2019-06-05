import * as sdk from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { DOCUMENTS } from '../../mocks';
import { withAssetFiles, WithAssetFilesDataProps } from '../withAssetFiles';

configure({ adapter: new Adapter() });

sdk.Files.list = jest.fn();

describe('withAssetFiles', () => {
  beforeEach(() => {
    // @ts-ignore
    sdk.Files.list.mockResolvedValue({ items: DOCUMENTS });
  });

  afterEach(() => {
    // @ts-ignore
    sdk.Files.list.mockClear();
  });

  it('Should render spinner', () => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    expect(wrapper.find('span.ant-spin-dot.ant-spin-dot-spin')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Should call render spinner', done => {
    const TestComponent = () => <div>Test Content</div>;
    const WrappedComponent = withAssetFiles(TestComponent);
    const loadHandler = jest.fn();
    mount(<WrappedComponent assetId={123} onAssetFilesLoaded={loadHandler} />);

    setImmediate(() => {
      expect(loadHandler).toBeCalled();
      done();
    });
  });

  it('Wrapped component should receive asset files  after loading', done => {
    const TestComponent: React.SFC<WithAssetFilesDataProps> = props => (
      <div>
        <p className="files-number">{props.assetFiles.length}</p>
        <p className="first-file-name">{props.assetFiles[0].fileName}</p>
      </div>
    );
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('p.files-number').text()).toEqual(
        DOCUMENTS.length.toString()
      );
      expect(wrapper.find('p.first-file-name').text()).toEqual(
        DOCUMENTS[0].fileName
      );
      done();
    });
  });

  it('Should request for an asset if assetId has been changed', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetFiles(TestComponent);
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.setProps({ assetId: 1234 });

    setImmediate(() => {
      expect(sdk.Files.list).toBeCalledTimes(2);
      done();
    });
  });

  it('Should not call setState on unmounted component', done => {
    const TestComponent = () => <div />;
    const WrappedComponent = withAssetFiles(TestComponent);
    WrappedComponent.prototype.setState = jest.fn();
    const wrapper = mount(<WrappedComponent assetId={123} />);

    wrapper.unmount();

    setImmediate(() => {
      expect(WrappedComponent.prototype.setState).not.toHaveBeenCalled();
      done();
    });
  });
});
