## With Load Callback 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { FilesMetadata } from '@cognite/sdk';
import { AssetDocumentsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {

  const handleAssetFilesLoaded = (files: FilesMetadata[]) => { };

  return (
    <AssetDocumentsPanel
      assetId={4650652196144007}
      onAssetFilesLoaded={handleAssetFilesLoaded}
    />
  );
  
}
```
