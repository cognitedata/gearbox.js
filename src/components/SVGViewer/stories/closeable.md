# Include a close button

<!-- STORY -->

#### Description:

Including the handleCancel prop will add a close button to the top bar

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const handleCancel = (): void => {};

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        documentId={5185355395511590}
        handleCancel={handleCancel}
      />
    </div>
  );

}
```
