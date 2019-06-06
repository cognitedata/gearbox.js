## On Load Callback 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { Asset } from '@cognite/sdk';
import { AssetDetailsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {

  const handleAssetLoaded = (asset: Asset) => { };

  return (
    <AssetDetailsPanel
      assetId={4650652196144007}
      onAssetLoaded={handleAssetLoaded}
    />
  );
  
}
```
