# Custom data fetching

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetBreadcrumb } from '@cognite/gearbox';
import { Asset, CogniteInternalId } from '@cognite/sdk';

function ExampleComponent(props) {
  const retrieveAsset = async (assetId:CogniteInternalId): Promise<Asset> => {/* ... \*/}
  return (
    <AssetBreadcrumb 
      assetId={4518112062673878} 
      retrieveAsset={retrieveAsset} 
    />
  );

}

```
