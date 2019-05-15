## Ruler

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart
      timeseriesIds={[123]}
      startTime={Date.now() - 60 * 1000}
      endTime={Date.now()}
      ruler={{
        visible: true,
        yLabel: (point) =>
          `${Number.parseFloat(point.value).toFixed(3)}`,
        timeLabel: (point) => point.timestamp,
      }}
    />
  );
  
}
```
