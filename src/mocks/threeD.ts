import { Cognite3DViewer, OnProgressData, THREE } from '@cognite/3d-viewer';
import { CogniteClient } from '@cognite/sdk';
import { Revision3D } from '@cognite/sdk';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { CacheObject, Callback, EventHandlers } from '../interfaces';
import {
  addEvent,
  removeEvent,
  ViewerConfigResponse,
  ViewerEventTypes,
} from '../utils/threeD';
import { MockCogniteClient } from './mockSdk';

export function createFakeViewer({
  project,
  sdk,
  cache = {},
  domElement,
}: {
  project: string;
  sdk: CogniteClient;
  cache: CacheObject;
  domElement: HTMLElement;
}): ViewerConfigResponse {
  if (cache[project]) {
    // @ts-ignore
    domElement.parentNode.replaceChild(
      cache[project].viewer.domElement,
      domElement
    );
    return {
      ...cache[project],
      domElement: cache[project].viewer.domElement,
    };
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

  const viewer = new Cognite3DViewer({ sdk, domElement, enableCache: true });

  const loader = new OBJLoader();
  loader.load('./tank/tank.obj', onLoad, onProgress);

  cache[project] = {
    viewer,
    modelPromise: Promise.resolve(null),
    addEvent: addEvent.bind(null, listeners),
    removeEvent: removeEvent.bind(null, listeners),
    domElement,
  };

  return cache[project];
}

export class Mock3DCogniteClient extends MockCogniteClient {
  revisions3D: any = {
    retrieve: (): Promise<Revision3D> => Promise.resolve(revision3D),
  };
}

const revision3D: Revision3D = {
  id: 1000,
  fileId: 1000,
  published: false,
  rotation: [0, 0, 0],
  camera: {
    target: [0, 0, 0],
    position: [0, 0, 0],
  },
  status: 'Done',
  thumbnailThreedFileId: 1000,
  thumbnailURL:
    'https://api.cognitedata.com/api/v1/project/myproject/3d/files/1000',
  assetMappingCount: 0,
  createdTime: new Date(),
};
