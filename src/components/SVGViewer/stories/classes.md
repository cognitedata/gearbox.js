# Specify custom classes for equipment

<!-- STORY -->

#### Description:

`metadataClassesConditions` callback is responsible for listing of classes and conditions on when they should be applied for equipment

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
          metadataClassesConditions={metadataClassesConditions}
        />
    </div>
  );

}
```
