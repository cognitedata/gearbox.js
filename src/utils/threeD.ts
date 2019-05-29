import {
  Cognite3DModel,
  Cognite3DViewer,
  OnProgressData,
  THREE,
} from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import { fetch3DModelRevision } from '../api';
import { CacheObject, Callback, EventHandlers } from '../interfaces';

interface ViewerConfig {
  modelId: number;
  revisionId: number;
  domElement: HTMLElement;
  cache?: CacheObject;
  boundingBox?: THREE.Box3;
}

export interface ViewerConfigResponse {
  viewer: Cognite3DViewer;
  modelPromise: Promise<Cognite3DModel>;
  revisionPromise: Promise<sdk.Revision>;
  addEvent: (events: [ViewerEventTypes, Callback][]) => void;
  removeEvent: (events?: [ViewerEventTypes, Callback][]) => void;
  fromCache?: boolean;
  domElement: HTMLElement;
}

export enum ViewerEventTypes {
  progress = 'progress',
  complete = 'complete',
  error = 'error',
}

export function parseBoundingBox(
  boundingBox: { min: number[]; max: number[] } | THREE.Box3
): THREE.Box3 {
  const { Box3, Vector3 } = THREE;

  if (boundingBox instanceof Box3) {
    return boundingBox;
  }

  return new Box3(
    new Vector3(...boundingBox.min),
    new Vector3(...boundingBox.max)
  );
}
export function setCameraPosition(
  viewer: Cognite3DViewer,
  model: Cognite3DModel,
  revision: sdk.Revision,
  boundingBox?: THREE.Box3
) {
  const { Vector3 } = THREE;
  const { camera } = revision;

  if (!camera) {
    return;
  }

  if (boundingBox && !boundingBox.isEmpty()) {
    // todo: matrix property doesn't present in Cognite3DModel
    // @ts-ignore
    boundingBox.applyMatrix4(model.matrix);
    viewer.fitCameraToBoundingBox(boundingBox, 0);
  } else if (Array.isArray(camera.target) && Array.isArray(camera.position)) {
    // Set default camera position
    const cameraPosition = new Vector3(...camera.position);
    const cameraTarget = new Vector3(...camera.target);
    // Camera position and target are defined in model space, transform to world space
    // @ts-ignore
    cameraPosition.applyMatrix4(model.matrix);
    // @ts-ignore
    cameraTarget.applyMatrix4(model.matrix);
    viewer.setCameraPosition(cameraPosition);
    viewer.setCameraTarget(cameraTarget);
  } else {
    viewer.fitCameraToModel(model, 0);
  }
}
export function createViewer({
  modelId,
  revisionId,
  boundingBox,
  cache,
  domElement,
}: ViewerConfig): ViewerConfigResponse {
  const hash = hashGenerator(modelId, revisionId, boundingBox);
  const { progress, complete, error } = ViewerEventTypes;

  if (cache && cache[hash]) {
    cache[hash].fromCache = true;
    // @ts-ignore
    domElement.parentNode.replaceChild(
      cache[hash].viewer.domElement,
      domElement
    );
    return {
      ...cache[hash],
      domElement: cache[hash].viewer.domElement,
    };
  }

  const revisionPromise = fetch3DModelRevision(modelId, revisionId);
  const viewer = new Cognite3DViewer({ domElement });

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

  const modelPromise = viewer.addModel({
    modelId,
    revisionId,
    geometryFilter: { boundingBox },
    onProgress,
    onComplete,
  });

  const response = {
    domElement,
    viewer,
    modelPromise,
    revisionPromise,
    addEvent: addEvent.bind(null, listeners),
    removeEvent: removeEvent.bind(null, listeners),
  };

  if (cache) {
    cache[hash] = response;
  }

  return response;
}

export function addEvent(
  listeners: EventHandlers,
  events: [ViewerEventTypes, Callback][]
) {
  events.forEach(([type, callback]: [ViewerEventTypes, Callback]) => {
    listeners[type].push(callback);
  });
}

export function removeEvent(
  listeners: EventHandlers,
  events?: [ViewerEventTypes, Callback][]
) {
  if (events) {
    events.forEach(([type, callback]: [ViewerEventTypes, Callback]) => {
      const index = listeners[type].indexOf(callback);
      if (index === -1) {
        return;
      }

      listeners[type].splice(index, 1);
    });

    return;
  }

  for (const key in ViewerEventTypes) {
    if (ViewerEventTypes[key]) {
      listeners[ViewerEventTypes[key]] = [];
    }
  }
}

export function hashGenerator(
  modelId: number,
  revisionId: number,
  boundingBox?: THREE.Box3
): string {
  let boundingBoxString;

  if (boundingBox) {
    const boundingBoxMinString = boundingBox.min.toArray().join(',');
    const boundingBoxMaxString = boundingBox.max.toArray().join(',');
    boundingBoxString = `[${boundingBoxMinString}, ${boundingBoxMaxString}]`;
  }

  return `${modelId}/${revisionId}${
    boundingBoxString ? '?boundingBox=' + boundingBoxString : ''
  }`;
}
