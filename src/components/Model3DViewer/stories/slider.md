## Add Visual Sliders

<!-- STORY -->

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
