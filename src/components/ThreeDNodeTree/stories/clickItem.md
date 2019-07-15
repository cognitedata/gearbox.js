## Click item in tree 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { ThreeDNodeTree, OnSelectNodeTreeParams } from '@cognite/gearbox';

const onSelect = (e: OnSelectNodeTreeParams) => {}

function ExampleComponent(props) {

  return (
    <ThreeDNodeTree
      modelId = {0} revisionId = {0} onSelect={onSelect}
    />
  );

}
```
