## Custom TimeseriesChartMeta

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTimeseriesPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetTimeseriesPanel
      defaultTimePeriod="lastHour"
      liveUpdate={false}
      showChart={true}
      showDescription={false}
      showDatapoint={true}
      showMetadata={false}
      showPeriods={true}
    />
  );
  
}
```
