## Ruler

A ruler can be displayed by using the `ruler` property.

When the pointer is moved across the chart, the ruler moves vertically.
The value of chart point(s) under the ruler are displayed as a list in a "cursor overview" near the pointer and the timestamp of the ruler is displayed at the bottom.

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChart, ChartRulerPoint } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart
      timeseriesIds={[123, 456]}
      startTime={Date.now() - 60 * 1000}
      endTime={Date.now()}
      ruler={{
        visible: true,
        yLabel: (point: ChartRulerPoint) =>
            `${Number(point.value).toFixed(3)}`,
        timeLabel: (point: ChartRulerPoint) =>
            new Date(point.timestamp).toISOString(),
      }}
    />
  );
  
}
```

`timeLabel` is an optional callback for formatting the ruler timestamp - this get called only once even with multiple points under the ruler.

`yLabel` is an optional callback for formatting the "value of each ruler point" - this gets called once for each point under the ruler

Since both `yLabel` and `timeLabel` are optional. giving an empty object for `ruler` prop uses the built-in timeLabel and yLabel callbacks.


