## With Load Callback 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { CogniteEvent } from '@cognite/sdk';
import { AssetEventsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {

  const handleAssetEventsLoaded = (events: CogniteEvent[]) => { };

  return (
    <AssetEventsPanel
      assetId={4650652196144007}
      onAssetEventsLoaded={handleAssetEventsLoaded}
    />
  );
  
}
```
