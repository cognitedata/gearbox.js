## Predefined Period

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { Timeseries } from '@cogmnite/sdk';
import { TimeseriesChartMeta } from '@cognite/gearbox';

const timeseries: Timeseries = {
  id: 8681821313339919,
  name: 'IA_21PT1019.AlarmByte',
  isString: false,
  unit: 'bar',
  metadata: {
    tag: 'IA_21PT1019.AlarmByte',
    scan: '1',
    span: '100',
    step: '1',
    zero: '0',
  },
  assetId: 4965555138606429,
  isStep: false,
  description: '21PT1019.AlarmByte',
};

function ExampleComponent(props) {
  return (
    <TimeseriesChartMeta
      timeseries={timeseries}
      defaultTimePeriod="lastMonth"
    />
  );
  
}
```
