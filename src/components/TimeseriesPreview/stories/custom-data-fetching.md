# Custom data fetching

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';
import { InternalId } from '@cognite/sdk';

function ExampleComponent(props) {
  const retrieveTimeseries = async (id: InternalId) => { ... };
  const retrieveLatestDatapoint = async (id: InternalId) => { ... };

  return (
    <TimeseriesPreview
      timeseriesId={41852231325889}
      retrieveTimeseries={retrieveTimeseries}
      retrieveLatestDatapoint={retrieveLatestDatapoint}
    />
  );

}
```
