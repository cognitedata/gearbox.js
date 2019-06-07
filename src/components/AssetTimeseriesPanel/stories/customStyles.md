## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTimeseriesPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetTimeseriesPanel
      assetId={4650652196144007}
      styles={{
        wrapper: {
          border: '2px red solid',
          width: '70%',
        },
        timeseriesContainer: {
          backgroundColor: '#efefef',
        },
      }}
    />
  );

}
```
