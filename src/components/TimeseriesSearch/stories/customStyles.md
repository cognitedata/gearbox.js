## Custom styles 

<!-- STORY -->

#### Info:
You can search for `${names}`

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: GetTimeSeriesMetadataDTO) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
      styles={{
        list: { height: '200px' },
        buttonRow: { marginTop: '30px' },
        selectAllButton: { backgroundColor: 'lightblue' },
        selectNoneButton: {
          backgroundColor: 'magenta',
          marginLeft: '50px',
        },
      }}
    />
  );
  
}
```
