## Handle callbacks

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetBreadcrumb } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

const onClick = (asset: Asset, depth: number) => console.log(asset);

function ExampleComponent(props) {
  return (
    <AssetBreadcrumb 
      assetId={4518112062673878} 
      onBreadcrumbClick={onClick} 
    />
  );

}
```
