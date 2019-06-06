## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetEventsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetEventsPanel
      assetId={4650652196144007}
      styles={{
        table: {border: '1px solid red'},
        tableRow: {borderBottom: '2px solid #999'},
        tableCell: {backgroundColor: '#DDD' },
      }}
    />
  );
  
}
```
