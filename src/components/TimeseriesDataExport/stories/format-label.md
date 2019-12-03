# Format Timeseries Label

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk'; 
import { TimeseriesDataExport, CSVLabelFormatter } from '@cognite/gearbox';

function ExampleComponent(props) {
  const labelFormatter: CSVLabelFormatter = 
    (ts: GetTimeSeriesMetadataDTO) => ts.name || \`timeserie-${ts.id}\`; 

  return (
    <TimeseriesDataExport
      timeseriesIds={[41852231325889, 7433885982156917]}
      granularity={'2m'}
      defaultTimeRange={[1567321800000, 1567408200000]}
      labelFormatter={labelFormatter}
    />
  );

}
```

