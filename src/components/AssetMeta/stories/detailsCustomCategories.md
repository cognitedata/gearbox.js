## Details with custom categories

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetMeta
      assetId={4650652196144007}
      detailsProps={{
        toCategory: name => name.split('_')[0],
        expandedCategories: ['SOURCE']
      }}
    />
  );
  
}
```
