## Allow strings 

<!-- STORY -->

#### Info:
You can search for `${names}`

#### Usage:

```typescript jsx
import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { Timeseries} from '@cognite/sdk';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: Timeseries) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
      allowStrings={true}
    />
  );
  
}
```
