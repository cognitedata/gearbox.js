## Hidden

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart timeseriesIds={[123, 456]} hiddenSeries={{123: true}} />
  );
  
}
```
