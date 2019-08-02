## Custom styles 

<!-- STORY -->

#### Info:
You can search for `${names}`

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { Timeseries} from '@cognite/sdk';
import { TimeseriesSearch } from '../TimeseriesSearch';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: Timeseries) => {}
const ExampleTheme = {
        gearbox: {
          selectColor: 'red',
        },
      };

function ExampleComponent(props) {
  return (
    <ThemeProvider theme={ExampleTheme}>
      <TimeseriesSearch
        onTimeserieSelectionChange={onTimeserieSelectionChange}
      />
    </ThemeProvider>
  );
  
}
```
