# Model3DViewer

<!-- STORY -->

#### Requirements:

To use this component you have to install `@cognite/3d-viewer` package (version 4.1.3):

```bash
yarn add @cognite/3d-viewer@4.1.3
```

#### Description:

This component can be used to visualize 3D models from Cognite Data Fusion.
The component will visualize the full 3D model by default, but by providing an optional `boundingBox` parameter, you can download only a specific area. This could for instance be around a specific asset.

To retrieve a 3D model you need to provide:

- `modelId` – you can find it using `sdk.ThreeD.listModels()` call
- `revisionId` – you can find it via `sdk.ThreeD.listRevisions(modelID)` call

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import {
  Cognite3DViewer,
  Cognite3DModel,
  OnProgressData,
} from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import { Model3DViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const cache = {};
  const modelId = 0;
  const revisionId = 0;
  const onClick = (modelId: number) => {};
  const onProgress = (progress: OnProgressData) => {};
  const onComplete = () => {};
  const onReady = (
    viewer: Cognite3DViewer,
    model: Cognite3DModel,
    revision: sdk.Revision
  ) => {};

  return (
    <Model3DViewer
      modelId={modelID}
      revisionId={revisionID}
      onClick={onClick}
      onProgress={onProgress}
      onComplete={onComplete}
      cache={cache}
    />
    
  );
  
}
```

#### Available props:

##### Required:

| Property      | Description              | Type     | Default |
| ------------- | ------------------------ | -------- | ------- |
| `modelId`     | model ID number          | `number` |         |
| `revisionId`  | model revision ID number | `number` |         |

##### Optionals:

| Property                   | Description                                                         | Type                                                                                | Default |
| -------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| `assetId`                  | id of asset to highlight                                            | `number`                                                                            |         |
| `boundingBox`              | bounding box object, that describes dimension of viewed asset nodes | `THREE.Box3`                                                                        |         |
| `cache`                    | object for caching 3D viewers instances                             | `{ [name:string]: any }`                                                            |         |
| `enableKeyboardNavigation` | enable keyboard navigation in viewer                                | `boolean`                                                                           |  false  |
| `useDefaultCameraPosition` | use default camera position                                         | `boolean`                                                                           |  true   |
| `onReady`                  | on scene prepared to display model callback                         | `(viewer: Cognite3DViewer, model: Cognite3DModel, revision: sdk.Revision) => void;` |         |
| `onProgress`               | on model loading progress callback                                  | `(progress: OnProgressData) => void;`                                               |         |
| `onComplete`               | on model complete loading callback                                  | `() => void;`                                                                       |         |
| `onClick`                  | on model click handler                                              | `(nodeId: number) => void;`                                                         |         |
| `onCameraChange`           | on scene camera change position callback                            | `(position: THREE.Vector3) => void;`                                                |         |


##### Interfaces:

```typescript jsx
import {
  Cognite3DViewer,
  Cognite3DModel,
  OnProgressData,
} from '@cognite/3d-viewer';
```
