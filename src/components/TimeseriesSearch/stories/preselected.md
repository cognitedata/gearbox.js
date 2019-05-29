## Preselected 

<!-- STORY -->

#### Info:
You can search for `${names}`

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { Timeseries} from '@cognite/sdk';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: Timeseries) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
      selectedTimeseries={[4536015939766876, 7108578362782757]}
    />
  );
  
}
```
