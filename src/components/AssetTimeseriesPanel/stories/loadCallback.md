## Custom Loading Spinner 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';
import { AssetTimeseriesPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  const handleAssetTimeseriesLoaded = (files: GetTimeSeriesMetadataDTO[]) => {};
  return (
    <AssetTimeseriesPanel
      assetId={4650652196144007}
      onAssetTimeseriesLoaded={handleAssetTimeseriesLoaded}
    />
  );
  
}
```
