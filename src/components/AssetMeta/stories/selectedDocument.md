## Returns Selected Document 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';
import { FilesMetadata } from '@cognite/sdk';

function ExampleComponent(props) {

  const handleDocumentClick = (
    document: FilesMetadata,
    category: string,
    description: string
    ) => { };
  
  return (
    <AssetMeta 
      assetId={4650652196144007}
      docsProps={{handleDocumentClick}}
    />
  );
  
}
```
