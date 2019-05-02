# Timeseries Chart

<!-- STORY -->

### Description:

This component loads the datapoints given a timeseries id and renders a line chart of those points.
The component requires only `timeseriesIds`

#### Usage:

```typescript jsx
import React from 'react';
import { TimeseriesChart } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesChart timeseriesIds={[123]} />
  );
  
}
```

#### Available props:

##### Required:

| Property        | Description             | Type       | Default |
| --------------- | ----------------------- | ---------- | ------- |
| `timeseriesIds` | Array of timeseries ids | `number[]` | `[]`    |

##### Optionals:

| Property               | Description                                                                 | Type                             | Default                        |
| ---------------------- | --------------------------------------------------------------------------- | -------------------------------- | ------------------------------ |
| `panelHeight`          | The height of the chart                                                     | `number`                         | `500`                          |
| `start`                | The time the timeseries should start from. Should be UNIX timestamp or Date | `number \| Date`                 | `Date.now() - 60 * 60 * 1000`  |
| `end`                  | The time the timeseries should end. Should be UNIX timestamp or Date        | `number \| Date`                 | `Date.now()`                   |
| `contextChart`         | Whether the context chart should be showed                                  | `boolean`                        | `false`                        |
| `zoomable`             | Whether zooming on the chart is enabled                                     | `boolean`                        | `false`                        |
| `liveUpdate`           | Whether live update of chart is enabled                                     | `boolean`                        | `false`                        |
| `updateIntervalMillis` | The update interval when live update is enabled                             | `number`                         | `5000`                         |
| `pointsPerSeries`      | The number of aggregated datapoints to show                                 | `number`                         | `600`                          |
| `yAxisPlacement`       | Placement of the y-axis                                                     | `'RIGHT' \| 'LEFT' \| 'BOTH'`    | `RIGHT`                        |
| `yAxisDisplayMode`     | Display mode of the y-axis                                                  | `'ALL' \| 'COLLAPSED' \| 'NONE'` | `ALL`                          |
