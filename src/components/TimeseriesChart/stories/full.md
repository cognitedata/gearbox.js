# Timeseries Chart

<!-- STORY -->

### Description:

This component loads the datapoints given a timeseries id and renders a line chart of those points.
The component requires only `timeseriesIds`

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

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

| Property               | Description                                                                 | Type                             | Default                                         |
| ---------------------- | ----------------------------------------------------------------------------| -------------------------------- | ----------------------------------------------- |
| `startTime`            | The time the timeseries should start from. Should be UNIX timestamp or Date | `number \| Date`                 | `Date.now() - 60 * 60 * 1000`                   |
| `endTime`              | The time the timeseries should end. Should be UNIX timestamp or Date        | `number \| Date`                 | `Date.now()`                                    |
| `contextChart`         | Whether the context chart should be showed                                  | `boolean`                        | `false`                                         |
| `zoomable`             | Whether zooming on the chart is enabled                                     | `boolean`                        | `false`                                         |
| `crosshair`            | Whether crosshair should be shown                                           | `boolean`                        | `false`                                         |
| `liveUpdate`           | Whether live update of chart is enabled                                     | `boolean`                        | `false`                                         |
| `updateIntervalMillis` | The update interval when live update is enabled                             | `number`                         | `5000`                                          |
| `pointsPerSeries`      | The number of aggregated datapoints to show                                 | `number`                         | `600`                                           |
| `yAxisPlacement`       | Placement of the y-axis                                                     | `'RIGHT' \| 'LEFT' \| 'BOTH'`    | `RIGHT`                                         |
| `yAxisDisplayMode`     | Display mode of the y-axis                                                  | `'ALL' \| 'COLLAPSED' \| 'NONE'` | `ALL`                                           |
| `xAxisHeight`          | Height of x-axis container in pixels. `0` will hide it completely           | `number`                         | `50`                                            |
| `timeseriesColors`     | Map of timeseries ids and color                                             | `{ [id:number]: string }`        | `ALL`                                           |
| `styles`               | Custom styles for the component                                             | `TimeseriesChartStyles`          |                                                 |
| `height`               | Height of the chart                                                         | `number`                         |                                                 |
| `width`                | Width of the chart                                                          | `number`                         |                                                 |
| `hiddenSeries`         | Object desribing if timeseries id should be hidden                          | `{[id: string]: boolean}`        | `{}`                                            |
| `ruler`                | Display the ruler and configure custom label formatters                     | `ChartRulerConfig`                    | `{}`                                            |


#### Types:

### TimeseriesChartStyles

This interface defines inline CSS styles for inner elements of `TimeseriesChart`component.
You can only override the outermost container.

The type can be imported from `@cognite/gearbox`:

```typescript
import { TimeseriesChartStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface TimeseriesChartStyles {
  container?: React.CSSProperties;
}
```

See more details in `Custom container styles` example.

### ChartRulerConfig

Defines the callbacks to configure the formatting of ruler label values.

```typescript
interface ChartRulerConfig {
  visible?: boolean;
  timeLabel?: (point: ChartRulerPoint) => string;
  yLabel?: (point: ChartRulerPoint) => string;
}
```

### ChartRulerPoint

Defines a point under the ruler.

```typescript
interface ChartRulerPoint {
  id: number | string;
  name: string;
  value: number | string;
  color: string;
  timestamp: number;
  x: number;
  y: number;
}
```
