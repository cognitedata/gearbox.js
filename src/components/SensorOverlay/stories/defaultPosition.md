## With Default Position and Custom Color 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { SensorOverlay, SensorPosition } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [  8681821313339919 ];
  const handleClick = (timeserieId: number) => {};
  const handleSettingsClick = (timeserieId: number) => {};
  const handlePositionChange = (timeserieId: number, position: SensorPosition) => {};

  return (
    <SensorOverlay
      timeserieIds={timeserieIds}
      colorMap={{ [8681821313339919]: '#33AA33' }}
      defaultPositionMap={{
        [8681821313339919]: {
          left: 0.5,
          top: 0.2,
          pointer: {
            left: 0.4,
            top: 0.8,
          },
        },
      }}
      onClick={handleClick}
      onSettingsClick={handleSettingsClick}
      onSensorPositionChange={handlePositionChange}
    >
      <div style={{ width: '100%', height: '250px', background: '#EEE' }} />
    </SensorOverlay>
  );

}
```
