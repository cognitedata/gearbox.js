# Timeseries Chart Meta

<!-- STORY -->

### Description:

This component shows an instance of `TimeseriesChart` component along with additional information about timeseries such as current data point (sensor value),
meta data of the timeserie, description. It also shows group of radio buttons to control a time period for `TimeseriesChart`.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { Timeseries } from '@cogmnite/sdk';
import { TimeseriesChart } from '@cognite/gearbox';

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
    <TimeseriesChartMeta timeseries={timeseries} />
  );
  
}
```

#### Available props:

##### Required:

| Property        | Description                                        | Type         | Default |
| --------------- | -------------------------------------------------- | ------------ | ------- |
| `timeseries`    | `Timeseries` object retrieved from `@cognite/sdk` | `Timeseries` |         |

##### Optionals:

| Property               | Description                                                                 | Type                             | Default                                         |
| ---------------------- | ----------------------------------------------------------------------------| -------------------------------- | ----------------------------------------------- |
| `liveUpdate`           | Defines whether to get live updates in chart and data point                 | `boolean`                        | `true`                                          |
| `updateIntervalMillis` | Interval in milliseconds for live updates                                   | `number`                         | `5000`                                          |
| `defaultTimePeriod`    | One of six predefined time periods: `'lastYear'`, `'lastMonth'`, `'lastWeek'`, `'lastDay'`, `'lastHour'`, `'last15Minutes'` | `TimeseriesChartMetaPeriod`      | `'lastHour'`                                      |
| `defaultBasePeriod`    | Custom time period for `TimeseriesChart`. This prop overrides `defaultTimePeriod`. Time values should be in timestamp format. | `{startTime: number, endTime: number}`|                              |
| `showDescription`      | Defines whether to show description of the timeseries                        | `boolean`                        | `true`                                         |
| `showPeriods`          | Defines whether to show time periods radio buttons                           | `boolean`                        | `true`                                         |
| `showChart`            | Defines whether to show timeseries chart                                     | `boolean`                        | `true`                                         |
| `showDatapoint`        | Defines whether to show current data point (sensor value)                    | `boolean`                        | `true`                                         |
| `showMetadata`         | Defines whether to show meta data of the timeseries                          | `boolean`                        | `true`                                         |



#### Types:

### Timeseries

This type can be imported from `@cognite/sdk`:

```typescript
import { Timeseries } from '@cognite/sdk';
```

### TimeseriesChartMetaPeriod

Definition:

```typescript
type TimeseriesChartMetaPeriod =  'lastYear' | 'lastMonth' | 'lastWeek' | 'lastDay' | 'lastHour' | 'last15minutes';
```
