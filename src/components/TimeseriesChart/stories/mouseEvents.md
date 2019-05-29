## Mouse events

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

const onMouseMove = e => {};
const onMouseOut = e => {};
const onBlur = e => {};

function ExampleComponent(props) {
  return (
    <TimeseriesChart
      timeseriesIds={[123]}
      startTime={Date.now() - 60 * 1000}
      endTime={Date.now()}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onBlur={onBlur}
    />
  );
  
}
```
