# Item click

<!-- STORY -->

#### Description:

If to click on any equipment name will be returned

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
        handleItemClick={handleItemClick}
      />
    </div>
  );

}
```
