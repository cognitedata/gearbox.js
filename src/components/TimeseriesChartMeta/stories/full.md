# Timeseries Chart Meta

<!-- STORY -->

### Description:

This component loads timeseries data by `timeseriesId` and shows an instance of `TimeseriesChart` component along with additional information about the timeseries such as current data point (sensor value),
meta data of the timeserie, description. It also shows group of radio buttons to control a time period for `TimeseriesChart`.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChartMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChartMeta timeseriesId={8681821313339919} />
  );
  
}
```

#### Available props:

##### Required:

| Property        | Description                                        | Type         | Default |
| --------------- | -------------------------------------------------- | ------------ | ------- |
| `timeseriesId`  | Timeseries Id                                      | `number`     |         |

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

### TimeseriesChartMetaPeriod

Definition:

```typescript
type TimeseriesChartMetaPeriod =  'lastYear' | 'lastMonth' | 'lastWeek' | 'lastDay' | 'lastHour' | 'last15minutes';
```
