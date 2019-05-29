## With Sticky Tooltips

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeseriesIds = [8681821313339919];

  return (
    <SensorOverlay
      timeseriesIds={timeseriesIds}
      stickyMap={{ [8681821313339919]: true }}
      defaultPositionMap={{
        [8681821313339919]: {
          left: 0.5,
          top: 0.5,
          pointer: {
            left: 0.4,
            top: 0.8,
          },
        },
      }}
    >
      <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
    </SensorOverlay>
  );
  
}
```
