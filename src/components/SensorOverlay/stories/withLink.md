## With Link

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';
import { Datapoint } from '@cognite/sdk';

function ExampleComponent(props) {
  const timeseriesIds = [8681821313339919];
  const handleClick = (timeserieId: number) => {};
  const handleLinkClick = (timeserieId: number, datapoint: Datapoint) => {};

  return (
    <SensorOverlay
      timeseriesIds={timeseriesIds}
      linksMap={{ [8681821313339919]: true }}
      onClick={handleClick}
      onLinkClick={handleLinkClick}
    >
      <div style={{ width: '100%', height: '200px', background: '#EEE' }} />
    </SensorOverlay>
  );
  
}
```
