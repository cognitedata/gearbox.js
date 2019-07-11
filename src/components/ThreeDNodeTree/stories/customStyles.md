## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { ThreeDNodeTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <ThreeDNodeTree
      modelId = {0} revisionId = {0}
      styles={{
        list: {
          fontFamily: 'Courier New',
          fontSize: 'large',
        }
      }}
    />
  );

}
```
