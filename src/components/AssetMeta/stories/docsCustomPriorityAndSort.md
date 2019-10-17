## Custom Documents Category Priority and Sort

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {

  const customCategorySort = (a: string, b: string) => a > b ? -1 : a < b ? 1 : 0;

  return (
    <AssetMeta 
      assetId={4650652196144007}
      docsProps={{
            customCategorySort,
            categoryPriorityList: ['ZE'],
          }}
    />
  );
  
}
```
