## Custom series

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AxisDisplayMode } from '@cognite/griff-react';
const yAccessor = (data: Datapoint) => data.value;
const y0Accessor =  (data: Datapoint) => d.max ? data.max : yAccessor(data);
const y1Accessor = (data: Datapoint) => d.max ? data.max : yAccessor(data);
 
const series = [
  {
    id: 123,
    color: 'green',
    yAxisDisplayMode: AxisDisplayMode.ALL,
    hidden: false,
    y0Accessor,
    y1Accessor,
    yAccessor,
  },
  {
    id: 456,
    color: 'red',
    y0Accessor,
    y1Accessor,
    yAccessor,
  },
];

function ExampleComponent(props) {
  return (
    <TimeseriesChart series={series} yAxisDisplayMode={'NONE'} />
  );
  
}
```
