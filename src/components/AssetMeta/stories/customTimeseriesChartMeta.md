## Custom TimeseriesChartMeta

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <AssetMeta 
      assetId={4650652196144007}
      timeseriesProps={{
        defaultTimePeriod: 'lastYear',
        showMetadata: false,
        showDatapoint: false,
        showDescription: false,
        liveUpdate: false,
      }}
    />
  );
  
}
```
