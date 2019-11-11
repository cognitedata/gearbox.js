# Styling

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';

function ExampleComponent(props) {
  const onMenuClick = (key: string, timeseries: GetTimeSeriesMetadataDTO) => { /* ... */ };
  
  const options = {
    edit: 'Edit item',
    emphasize: 'Emphasize',
    remove: 'Remove',
  };
  const styles = {
    wrapper: { padding: '5px', backgroundColor: '#ffe25a' },
    card: { padding: '5px', backgroundColor: '#8fffbb' },
    leftSide: { padding: '5px', backgroundColor: '#454aff' },
    rightSide: { padding: '5px', backgroundColor: '#ffeeac' },
    tagName: { padding: '5px', backgroundColor: '#944eff' },
    description: { padding: '5px', backgroundColor: '#ff7ac1' },
    value: { padding: '5px', backgroundColor: '#ff5344' },
    date: { padding: '5px', backgroundColor: '#bbff1c' },
    dropdown: {
      menu: { padding: '5px', backgroundColor: '#8883ff' },
      item: { padding: '5px', backgroundColor: '#00d8ff' },
    },
  };

  return (
    <TimeseriesPreview
      timeseriesId={41852231325889}
      styles={styles}
      dropdown={{ options: options, onClick: onMenuClick }}
    />
  );

}
```
