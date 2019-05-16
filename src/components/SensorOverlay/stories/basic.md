## Basic 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [ 8681821313339919 ];

  return (
    <SensorOverlay timeserieIds={ timeserieIds }>
      <div style={{ width: '100%', height: '200px', background: '#EEE' }} />
    </SensorOverlay>
  );

}
```
