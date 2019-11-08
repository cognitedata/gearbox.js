# Dropdown menu configuration

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';

function ExampleComponent(props) {
  const onMenuClick = (key: string, timeseries: GetTimeSeriesMetadataDTO) => { ... };
  
  const options = {
    edit: 'Edit item',
    emphasize: 'Emphasize',
    remove: 'Remove',
  };

  return (
    <TimeseriesPreview
      timeseriesId={41852231325889}
      dropdown={{ options, onClick: onMenuClick }}
    />
  );

}
```
