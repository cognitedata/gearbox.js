## With Load Callback 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { Event } from '@cognite/sdk';
import { AssetEventsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {

  const handleAssetEventsLoaded = (events: Event[]) => { };

  return (
    <AssetEventsPanel
      assetId={4650652196144007}
      onAssetEventsLoaded={handleAssetEventsLoaded}
    />
  );
  
}
```
