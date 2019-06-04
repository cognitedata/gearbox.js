## Disabled Updates

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChartMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChartMeta 
      timeseriesId={8681821313339919}
      liveUpdate={false}
    />
  );
  
}
```
