## Take screenshots of the model

<!-- STORY -->
#### Description:
Set showScreenshotButton to true to add a button that takes screenshot of the model after being clicked.
Set the onScreenshot property to customize what you want to do witht the screenshots.

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
