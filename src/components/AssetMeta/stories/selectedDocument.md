## Returns Selected Document 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { AssetMeta } from '@cognite/gearbox';
import { File as Document } from '@cognite/sdk';

function ExampleComponent(props) {

  const handleDocumentClick = (
    document: Document,
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
