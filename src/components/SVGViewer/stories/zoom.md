# Zoom callback

<!-- STORY -->

#### Description:

While zooming callback is params will be fired

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer, ZoomCenter } from '@cognite/gearbox';

function ExampleComponent(props) {
  const zoomCallback = ({ 
    zoomProgress, 
    source, 
    zoomCenter 
  } : { 
    zoomProgress: number;
    source: string; 
    zoomCenter?: ZoomCenter; 
  }): void => {};

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        documentId={5185355395511590}
        handleAnimateZoom={zoomCallback}
      />
    </div>
  );

}
```
