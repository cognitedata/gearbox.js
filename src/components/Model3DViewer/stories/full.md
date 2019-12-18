# Model3DViewer

<!-- STORY -->

#### Requirements:

To use this component you have to install `@cognite/3d-viewer` package (version 5.x.x):

```bash
yarn add @cognite/3d-viewer@5
```

#### Description:

This component can be used to visualize 3D models from Cognite Data Fusion.
The component will visualize the full 3D model by default, but by providing an optional `boundingBox` parameter, you can download only a specific area. This could for instance be around a specific asset.

To retrieve a 3D model you need to provide:

- `modelId` – you can get it via SDK call – `Models3DAPI.list()`. You receive an iterator as a result, which could be used to get list of model ids associated to your tenant. 
- `revisionId` – you can get it via SDK call `Revisions3DAPI.list(modelId)`. You receive an iterator as a result, which could be used to get list of revision ids available for provided modelId

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import {
  Cognite3DViewer,
  Cognite3DModel,
  OnProgressData,
} from '@cognite/3d-viewer';
import { Revision3D } from '@cognite/sdk';
import { Model3DViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const cache = {};
  const modelId = 0;
  const revisionId = 0;
  const onClick = (nodeId: number) => {};
  const onProgress = (progress: OnProgressData) => {};
  const onComplete = () => {};
  const onReady = (
    viewer: Cognite3DViewer,
    model: Cognite3DModel,
    revision: Revision3D
  ) => {};

  return (
    <Model3DViewer
      modelId={modelId}
      revisionId={revisionId}
      onClick={onClick}
      onProgress={onProgress}
      onComplete={onComplete}
      onReady={onReady}
      cache={cache}
    />
  
    );

}
```

#### Available props:

##### Required:

| Property     | Description              | Type     | Default |
| ------------ | ------------------------ | -------- | ------- |
| `modelId`    | model ID number          | `number` |         |
| `revisionId` | model revision ID number | `number` |         |

##### Optionals:

| Property                   | Description                                                                                          | Type                                                                                | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| `assetId`                  | id of asset to highlight                                                                             | `number`                                                                            |         |
| `boundingBox`              | bounding box object, that describes dimension of viewed asset nodes                                  | `THREE.Box3`                                                                        |         |
| `cache`                    | object for caching 3D viewers instances                                                              | `{ [name:string]: any }`                                                            |         |
| `highlightMappedNodes`     | enable default highlighting of 3D nodes that are associated with some asset                          | `boolean`                                                                           | true    |
| `enableKeyboardNavigation` | enable keyboard navigation in viewer. Viewer must be in focus                                        | `boolean`                                                                           | true    |
| `onError`                  | on error occurs callback                                                                             | `(viewer: Cognite3DViewer, model: Cognite3DModel, revision: sdk.Revision) => void;` |         |
| `onReady`                  | on scene prepared to display model callback (return internal instances of viewer and model)          | `(viewer: Cognite3DViewer, model: Cognite3DModel, revision: sdk.Revision) => void;` |         |
| `onProgress`               | on model loading progress callback                                                                   | `(progress: OnProgressData) => void;`                                               |         |
| `onComplete`               | on model complete loading callback (in this callback you can start to call viewer and model methods) | `() => void;`                                                                       |         |
| `onClick`                  | on model click handler                                                                               | `(nodeId: number) => void;`                                                         |         |
| `onCameraChange`           | on scene camera change position callback                                                             | `(position: THREE.Vector3) => void;`                                                |         |
| `useDefaultCameraPosition` | use default camera position                                                                          | `boolean`                                                                           | true    |
| `slice` | set the slicing property of viewer | `{x?: { coord: number; direction: boolean }; y?: { coord: number; direction: boolean }; z?: { coord: number; direction: boolean };}`|    |
| `showScreenshotButton`| enable screenshot button in viewer | `boolean` | false|
| `onScreenshot` | callback after screenshot is taken | `(url: string) => void;`| ||
| `slider` | enable visual sliders for the viewer | `{x?: { max: number; min: number }; y?: { max: number; min: number }; z?: { max: number; min: number };}`| ||
| `styles` | allow wrapper and viewer styling  | `Model3DViewerStyles`| ||

##### Interfaces:

```typescript jsx
import { Model3DViewerStyles } from '@cognite/gearbox'

import {
  Cognite3DViewer,
  Cognite3DModel,
  OnProgressData,
} from '@cognite/3d-viewer';
```

##### Styles prop interface description:

```typescript jsx
export interface Model3DViewerStyles {
  wrapper: React.CSSProperties;
  viewer: React.CSSProperties;
}
```

##### `assetId` prop explanation

This prop is needed to control highlighting of asset node in the model right after init process or by changing `assetId` prop after viewer has been initialized.
