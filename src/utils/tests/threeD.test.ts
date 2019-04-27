import 'regenerator-runtime';

import { THREE } from '@cognite/3d-viewer';
import { Callback } from '../../interfaces';

import {
  addEvent,
  parseBoundingBox,
  removeEvent,
  ViewerEventTypes,
} from '../threeD';

describe('parseBoundingBox', () => {
  it('should return provided value', () => {
    const bb = new THREE.Box3();

    expect(parseBoundingBox(bb)).toEqual(bb);
  });

  it('should return provided value', () => {
    const bb = {
      min: [1, 1, 1],
      max: [2, 2, 2],
    };

    expect(parseBoundingBox(bb)).toBeInstanceOf(THREE.Box3);
  });
});

describe('addEvent and removeEvent', () => {
  it('should add and remove events handlers', () => {
    const events = [['progress', jest.fn()], ['complete', jest.fn()]];
    const liseteners = {
      progress: [],
      complete: [],
    };
    addEvent(liseteners, events as [ViewerEventTypes, Callback][]);

    expect(liseteners.progress.length).toEqual(1);
    expect(liseteners.complete.length).toEqual(1);

    removeEvent(liseteners, [events[0]] as [ViewerEventTypes, Callback][]);

    expect(liseteners.progress.length).toEqual(0);
    expect(liseteners.complete.length).toEqual(1);

    removeEvent(liseteners);

    expect(liseteners.complete.length).toEqual(0);
  });
});
