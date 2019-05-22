import { Cognite3DViewer, OnProgressData, THREE } from '@cognite/3d-viewer';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { CacheObject, Callback, EventHandlers } from '../interfaces';
import {
  addEvent,
  removeEvent,
  ViewerConfigResponse,
  ViewerEventTypes,
} from '../utils/threeD';

export function createFakeViewer({
  project,
  cache = {},
  domElement,
}: {
  project: string;
  cache: CacheObject;
  domElement: HTMLElement;
}): ViewerConfigResponse {
  if (cache[project]) {
    return cache[project];
  }

  const { progress, complete, error } = ViewerEventTypes;
  const listeners: EventHandlers = {
    [progress]: [],
    [complete]: [],
    [error]: [],
  };

  const onProgress: Callback = (progressEvent: OnProgressData) => {
    listeners[progress].forEach(callback => callback(progressEvent));
  };

  const onComplete: Callback = () => {
    listeners[complete].forEach(callback => callback());
  };

  const onLoad = async (object: THREE.Object3D) => {
    const bb = new THREE.Box3().setFromObject(object);

    // @ts-ignore
    viewer.addObject3D(object);
    viewer.fitCameraToBoundingBox(bb);
    onComplete();
  };

  const viewer = new Cognite3DViewer({ domElement });

  const loader = new OBJLoader();
  loader.load('./tank/tank.obj', onLoad, onProgress);

  cache[project] = {
    viewer,
    modelPromise: Promise.resolve(null),
    revisionPromise: Promise.resolve(null),
    addEvent: addEvent.bind(null, listeners),
    removeEvent: removeEvent.bind(null, listeners),
  };

  return cache[project];
}
