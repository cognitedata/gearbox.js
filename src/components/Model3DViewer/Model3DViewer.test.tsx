import { CogniteClient } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { fakeModel3DViewerClient } from '../../mocks';

import { ClientSDKProvider } from '../ClientSDKProvider';
import { mockCreateViewer, Model3DViewer } from './Model3DViewer';


jest.mock('@cognite/sdk', () => ({
  __esModule: true,
  CogniteClient: jest.fn().mockImplementation(() => {
    return fakeModel3DViewerClient;
  }),
}));

const sdk = new CogniteClient({ appId: 'gearbox test' });

configure({ adapter: new Adapter() });

const onProgress = jest.fn();
const onComplete = jest.fn();
const onReady = jest.fn();
const addEvent = jest.fn();
const removeEvent = jest.fn();
const onError = jest.fn(e => console.log(e));

const viewer = {
  on: jest.fn(),
  off: jest.fn(),
  disableKeyboardNavigation: jest.fn(),
};

const domElement = document.createElement('div');

const callbacksCreateViewer = jest.fn(() => ({
  addEvent,
  removeEvent,
  modelPromise: Promise.resolve(),
  viewer,
  domElement,
}));

afterEach(() => {
  jest.clearAllMocks();
});

mockCreateViewer(callbacksCreateViewer);

describe('Model3DViewer', () => {
  it('renders without exploding', done => {
    const props = {
      modelId: 0,
      revisionId: 0,
    };

    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <Model3DViewer {...props} />
      </ClientSDKProvider>
    );
    expect(wrapper.exists()).toBe(true);
    done();
  });

  it('should trigger provided callbacks', done => {
    const props = {
      modelId: 0,
      revisionId: 0,
      onProgress,
      onComplete,
      onReady,
      onError,
    };

    const wrapper = mount(
      <ClientSDKProvider client={sdk}>
        <Model3DViewer {...props} />
      </ClientSDKProvider>
    );
    setImmediate(() => {
      expect(addEvent).toHaveBeenCalledTimes(2);
      expect(onReady).toHaveBeenCalledTimes(1);

      wrapper.unmount();

      expect(removeEvent).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
