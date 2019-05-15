## Click item in tree 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree, OnSelectAssetTreeParams } from '@cognite/gearbox';

const onSelect = (e: OnSelectAssetTreeParams) => {}

function ExampleComponent(props) {

  return (
    <AssetTree
      onSelect={onSelect}
    />
  );

}
```
