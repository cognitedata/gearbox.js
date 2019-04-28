# Model3DViewer

<!-- STORY -->

#### Description:

Component uses for retrieving 3D-models, which is available for provided project.
Via providing modelId and revisionId values, user have ability to get a 3D model
of some asset. Via providing `boundingBox` value user can manage displayed number
of asset's nodes, that hits `boundingBox` dimension.

For retrieving 3D model you need to provide:

- `projectName` – your project name
- `modelId` – you can find it using `sdk.ThreeD.listModels()` call
- `revisionId` – you can find it via `sdk.ThreeD.listRevisions(modelID)` call

#### Usage:

```typescript jsx
import React from 'react';
import { Cognite3DViewer, Cognite3DModel, OnProgressData } from '@cognite/3d-viewer';
import * as sdk from '@cognite/sdk';
import { Model3DViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const projectName = 'publicdata';
  const modelID = 0;
  const revisionID = 0;
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
      projectName={projectName}
      onClick={onClick}
      onProgress={onProgress}
      onComplete={onComplete}
      
    />
    
  );
  
}
```

#### Available props:

##### Required:

| Property      | Description              | Type     | Default |
| ------------- | ------------------------ | -------- | ------- |
| `projectName` | Name of your project     | `string` |         |
| `modelId`     | model ID number          | `number` |         |
| `revisionId`  | model revision ID number | `number` |         |

##### Optionals:

| Property                | Description                                                         | Type                                                                                | Default |
| ----------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| `boundingBox`           | bounding box object, that describes dimension of viewed asset nodes | `THREE.Box3`                                                                        | {}      |
| `cache`                 | object for caching 3D viewers instances                             | `{ [name:string]: any }`                                                            |         |
| `useDefaultCameraPosition` | setting camera to default position on created 3D scene              | `boolean`                                                                           | true    |
| `onReady`               | on scene prepared to display model callback                         | `(viewer: Cognite3DViewer, model: Cognite3DModel, revision: sdk.Revision) => void;` |         |
| `onProgress`            | on model loading progress callback                                  | `(progress: OnProgressData) => void;`                                               |         |
| `onComplete`            | on model complete loading callback                                  | `() => void;`                                                                       |         |
| `onClick`               | on model click handler                                              | `(nodeId: number) => void;`                                                         |         |
| `onCameraChange`        | on scene camera change position callback                            | `(position: THREE.Vector3) => void;`                                                |         |

##### Default boundingBox value:

```typescript jsx
const boundingBox = new THREE.Box3({
  min: { x: Infinity, y: Infinity, z: Infinity },
  max: { x: -Infinity, y: Infinity, z: -Infinity },
});
```

##### Interfaces:
```typescript jsx
import { Cognite3DViewer, Cognite3DModel, OnProgressData } from '@cognite/3d-viewer';
```
