## Basic

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeseriesIds = [8681821313339919];

  return (
    <SensorOverlay timeseriesIds={timeseriesIds}>
      <div style={{ width: '100%', height: '200px', background: '#EEE' }} />
    </SensorOverlay>
  );
  
}
```
