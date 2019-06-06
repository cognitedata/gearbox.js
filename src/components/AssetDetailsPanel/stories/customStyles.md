## Custom Styles 

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
      styles={{ border: '1px solid red' }}
    />
  );
  
}
```
