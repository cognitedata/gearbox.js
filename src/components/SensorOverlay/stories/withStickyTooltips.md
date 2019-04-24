## With Sticky Tooltips

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [ 8681821313339919 ];

  return (
    <SensorOverlay
      timeserieIds={timeserieIds}
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
