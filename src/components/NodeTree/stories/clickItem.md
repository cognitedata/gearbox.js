## Click item in tree 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { NodeTree, OnSelectNodeTreeParams } from '@cognite/gearbox';

const onSelect = (e: OnSelectNodeTreeParams) => {}

function ExampleComponent(props) {

  return (
    <NodeTree
      modelId = {0} revisionId = {0} onSelect={onSelect}
    />
  );

}
```
