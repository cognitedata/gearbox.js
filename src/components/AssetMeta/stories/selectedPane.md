## Returns Selected Pane

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onPaneChange = (pane: string) => { };
  
  return (
    <AssetMeta 
      assetId={4650652196144007}
      onPaneChange={onPaneChange} 
    />
  );
  
}
```
