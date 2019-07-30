## Slice the model

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import React from 'react';
import { Model3DViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <Model3DViewer
      modelId={0}
      revisionId={0}
      slice={{ y: { coord: 0, direction: false }}}
    />
  );

}
```
