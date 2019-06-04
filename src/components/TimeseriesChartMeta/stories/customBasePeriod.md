## Custom Base Period

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChartMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChartMeta
      timeseriesId={8681821313339919}
      defaultBasePeriod={{
        startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        endTime: Date.now(),
      }}
    />
  );
  
}
```
