## Custom Loading Spinner 

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
      columns={[
        {
          title: 'Name',
          dataIndex: 'typeAndSubtype',
          key: 'typeAndSubtype',
        },
        {
          title: 'Custom Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'From',
          dataIndex: 'start',
          key: 'start',
        },
        {
          title: 'To',
          dataIndex: 'end',
          key: 'end',
        },
      ]}
    />
  );
  
}
```
