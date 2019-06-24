## Custom styles 

<!-- STORY -->

#### Info:
You can search for `${names}`

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk/dist/src/types/types';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: GetTimeSeriesMetadataDTO) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
      rootAssetSelect={true}
      strings={{
        rootAssetSelectAll: 'No filter',
        searchPlaceholder: 'search for stuff!',
        selectAll: 'Everything!',
        selectNone: 'Nothing!',
      }}
    />
  );
  
}
```
