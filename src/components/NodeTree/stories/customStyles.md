## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { NodeTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <NodeTree
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
