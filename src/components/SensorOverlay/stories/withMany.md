## With Many Sensors 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [ 
    8681821313339919,
    4965555138606429,
    1762612637163055,
    7108578362782757,
  ];

  return (
    <SensorOverlay timeserieIds={ timeserieIds }>
      <div style={{ width: '100%', height: '220px', background: '#EEE' }} />
    </SensorOverlay>
  );

}
```
