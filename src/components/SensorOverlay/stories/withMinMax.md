## With Min-Max Limit

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [ 8681821313339919 ];

  return (
    <SensorOverlay
      timeserieIds={timeserieIds}
      stickyMap={{ [8681821313339919]: true }}
      alertColor={'magenta'}
      minMaxMap={{
        [8681821313339919]: {
          min: 5,
          max: 10,
        },
      }}
    >
      <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
    </SensorOverlay>
  );

}
```
