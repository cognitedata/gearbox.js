import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { mockCreateViewer, Model3DViewer } from './Model3DViewer';

configure({ adapter: new Adapter() });

const onProgress = jest.fn();
const onComplete = jest.fn();
const onReady = jest.fn();
const addEvent = jest.fn();
const removeEvent = jest.fn();

const viewer = {
  getCanvas: () => document.createElement('div'),
  on: jest.fn(),
  off: jest.fn(),
};

const callbacksCreateViewer = jest.fn(() => ({
  addEvent,
  removeEvent,
  modelPromise: Promise.resolve(),
  revisionPromise: Promise.resolve(),
  viewer,
}));

afterEach(() => {
  jest.clearAllMocks();
});

mockCreateViewer(callbacksCreateViewer);

describe('Model3DViewer', () => {
  it('renders without exploding', done => {
    const props = {
      projectName: 'publicdata',
      modelId: 0,
      revisionId: 0,
    };

    const wrapper = mount(<Model3DViewer {...props} />);
    expect(wrapper.exists()).toBe(true);
    done();
  });
  it('should trigger provided callbacks', done => {
    const props = {
      projectName: 'publicdata',
      modelId: 0,
      revisionId: 0,
      onProgress,
      onComplete,
      onReady,
    };

    const wrapper = mount(<Model3DViewer {...props} />);

    setImmediate(() => {
      expect(addEvent).toHaveBeenCalledTimes(2);
      expect(onReady).toHaveBeenCalledTimes(1);

      wrapper.unmount();

      expect(removeEvent).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
