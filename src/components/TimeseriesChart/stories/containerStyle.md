## Container style

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart
      timeseriesIds={[123]}
      styles={{
        container: { height: '300px', backgroundColor: 'lightblue' },
      }}
    />
  );
  
}
```
