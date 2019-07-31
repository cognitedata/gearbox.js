## Add Visual Sliders

<!-- STORY -->
#### Description:
Specify the mininal and maximal lengths you want to slice from the corresponding axis to 
add visual sliders to the model.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import React from 'react';
import { Model3DViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <Model3DViewer
        modelId={modelID}
        revisionId={revisionID}
        slider={{
            x: { min: -1.5, max: 1.5 },
            y: { min: -1.5, max: 1.5 },
            z: { min: -5.5, max: 1 },
        }}
    />
  );

}
```
