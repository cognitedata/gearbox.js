## Default expanded node 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { NodeTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <NodeTree
      modelId = {0} revisionId = {0} defaultExpandedKeys={[1, 2, 3]}
    />
  );

}
```
