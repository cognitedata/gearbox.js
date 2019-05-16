## Custom filter rule 

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
const filterRule = (timeseries: Timeseries) =>  !timeseries.isString;
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
      filterRule={filterRule}
    />
  );

}
```
