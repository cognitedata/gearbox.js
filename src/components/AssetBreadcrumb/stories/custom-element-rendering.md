## Custom element rendering

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetBreadcrumb } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

const customElementRendering = (asset: Asset, depth: number) => (
  <span style={{ backgroundColor: 'red' }}>{`${depth}. ${asset.name}`}</span>
);

function ExampleComponent(props) {
  return (
    <AssetBreadcrumb 
      assetId={4518112062673878} 
      maxLength={5} 
      renderItem={customElementRendering} 
    />
  );

}
```
