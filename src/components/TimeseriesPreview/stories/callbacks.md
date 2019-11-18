# Callbacks

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';

function ExampleComponent(props) {
  const onToggleVisibility = (timeseries: GetTimeSeriesMetadataDTO) => { /* ... */ };

  return (
    <TimeseriesPreview
      timeseriesId={41852231325889}
      onToggleVisibility={onToggleVisibility}
    />
  );

}
```
