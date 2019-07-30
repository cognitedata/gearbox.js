## Take screenshots of the model

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
      showScreenshotButton={true}
      onScreenshot={(url: string) => {
        const img = document.createElement('img');
        img.src = url;
        document.body.append(img);
    }}
    />
  );

}
```
