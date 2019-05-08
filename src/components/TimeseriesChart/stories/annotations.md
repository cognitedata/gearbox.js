## Annotations

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart
      timeseriesIds={[123]}
      startTime={Date.now() - 60 * 1000}
      endTime={Date.now()}
      annotations={[
        {
          data: [Date.now() - 30 * 1000, Date.now() - 20 * 1000],
          height: 30,
          id: 888,
        },
      ]}
    />
  );
  
}
```
