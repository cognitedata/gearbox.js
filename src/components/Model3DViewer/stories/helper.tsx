import { OnProgressData } from '@cognite/3d-viewer';
import React from 'react';
import * as THREE from 'three';
import {
  createFakeViewer,
  generateNumber,
  Mock3DCogniteClient,
} from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { mockCreateViewer } from '../Model3DViewer';

const client = new Mock3DCogniteClient({ appId: 'gearbox test' });

export const decorators = (() => {
  mockCreateViewer(createFakeViewer);
  return [
    (storyFn: any) => (
      <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
    ),
  ];
})();

export const modelId = 0;

export const revisionId = 0;

export const cache = {};

export const onClick = (modelID: number, point: THREE.Vector3) =>
  console.log(
    'onClick',
    modelID || generateNumber(),
    point ||
      new THREE.Vector3(generateNumber(), generateNumber(), generateNumber())
  );

export const onProgress = (progress: OnProgressData) =>
  console.log('onProgress', progress);

export const onComplete = () => console.log('onComplete');

export const onReady = () =>
  console.log(
    'onReady',
    { name: 'viewer' },
    { name: 'model' },
    { name: 'revision' }
  );

export const onScreenshot = (url: string) => {
  const randomCode = Math.random()
    .toString(36)
    .substring(8);
  const downloadElm = document.createElement('a');
  downloadElm.href = url;
  downloadElm.download = `model_3D_viewer_screen_shot_${randomCode}`;
  downloadElm.click();
};

export const slice = { y: { coord: 0, direction: false } };

export const slider = {
  x: { min: -1.5, max: 1.5 },
  y: { min: -1.5, max: 1.5 },
  z: { min: -5.5, max: 1 },
};
