# Timeseries Chart Download

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesDataExport } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesDataExport
      visible={true}
      timeserieIds={[41852231325889]}
      granularity={'2s'}
      cellLimit={5000}
      defaultTimeRange={[1567321800000, 1567408200000]}
      strings={{
        cellLimitErr:
          'Ooops, you rich cell limit for CSV document – {{ cellLimit }} cells, some data may be omitted',
      }}
    />
  );

}
```

