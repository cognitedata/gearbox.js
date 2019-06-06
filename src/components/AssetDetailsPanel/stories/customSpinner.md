## Custom Loading Spinner 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetDetailsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetDetailsPanel
      assetId={4650652196144007}
      customSpinner={<div>Loading...</div>}
    />
  );
  
}
```
