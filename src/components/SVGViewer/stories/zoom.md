# Zoom callback

<!-- STORY -->

#### Description:

While zooming callback is params will be fired

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <SVGViewer
        documentId={5185355395511590}
        handleAnimateZoom={zoomCallback}
      />
    </div>
  );

}
```
