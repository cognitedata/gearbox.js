# Locate asset in the document

<!-- STORY -->

#### Description:

`isCurrentAsset` callback is responsible for locating the asset and zooming into its area

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
        isCurrentAsset={(metadata: Element) =>
          getTextFromMetadataNode(metadata) === '21PT1019'
        }
      />
    </div>
  );

}
```
