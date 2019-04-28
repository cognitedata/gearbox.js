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
      start={new Date(2019, 3, 1)}
      end={new Date(2019, 4, 1)} 
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
      start={1554069600000}
      end={1556661600000)} 
    />
  );
  
}
```
