## Start and end

<!-- STORY -->

#### Usage:
##### Date:

```typescript jsx
import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart 
      timeseriesIds={[123]} 
      startTime={new Date(2019, 3, 1)}
      endTime={new Date(2019, 4, 1)}
    />
  );
  
}
```

##### Number (UNIX timestamp):

```typescript jsx
import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart 
      timeseriesIds={[123]} 
      startTime={1554069600000}
      endTime={1556661600000)}
    />
  );
  
}
```
