# Sensor Overlay

<!-- STORY -->

### Description:

Renders set of latest timeseries (sensors) data. Each sensor is represented as a draggable box (tag) connected by line with round pointer. All sensor items are drawn on top of wrapped content.
This component can be used as a container of an infographic image for displaying real-time sensors data.
The height of SensorOverlay component is defined by content in `children` and the width takes `100%` unless `fixedWidth` is provided. This component requires a list of timeserie IDs and once they are passed via
`timeserieIds` prop SensorOverlay fetches meta information (name, description, etc) for all timeseries in the list and then constantly fetches latest data (Datapoint) for each timeserie with interval provided in `refreshInterval` (5 seconds by default).

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SensorOverlay } from '@cognite/gearbox';

function ExampleComponent(props) {
  const timeserieIds = [ 8681821313339919 ];

  return (
    <SensorOverlay timeserieIds={ timeserieIds }>
      <div style={{ width: '100%', height: '160px', background: '#EEE' }} />
    </SensorOverlay>,
  );

}
```

#### Available props:
##### Required:

| Property              | Description                                                        | Type                  | Default |
| --------------------- | ------------------------------------------------------------------ | --------------------- | ------- |
| `timeserieIds`        | List of timeserie Ids                                              | `number[]`            |         |
| `children`            | Wrapped content. Usually infographic image.                        | `React.ReactNode`     |         |

##### Optionals:

| Property              | Description                                                      | Type                               | Default |
| --------------------- | ---------------------------------------------------------------- | ---------------------------------- | ------- |
| `refreshInterval`     | Number in milliseconds that defines refresh interval for fetching latest timeserie data | number      | 5000    |
| `colorMap`            | Object map that defines custom colors for timeseries             | { [timeserieId: number]: string }  |         |
| `defaultPositionMap`  | Object map that defines position of newly added sensors in `timeserieIds`. The map doesn't affect position of previously added or dragged sensors.         | { [timeserieId: number]: SensorPosition }  |          |
| `skickyMap`           | Object map that defines which timeseries will show tooltips with name and description without mouse hovering  | { [timeserieId: number]: boolean } |       |
| `minMaxMap`           | Object map that defines a normal range for sensor values and once the value is out of this range an alert bar will be shown | { [timeserieId: number]: SensorMinMaxRange } |       |
| `linksMap`            | Object map that defines if it's needed to wrap timeserie values in the anchor tag `<a>`, works in conjunction with `onLinkClick` | { [timeserieId: number]: boolean } |       |
| `alertColor`          | Works in conjuction with `minMaxMap`. Defines background color of the alert tooltip that is shown if sensor value is out of min/max range. The dragdable circle in the tag should also have the alert color if the sensor value is out of range. | string  | `#e74c3c`    |
| `fixedWidth`          | By default SensorOverlay takes 100% width in current block context but if `fixedWidth` is given the width will be fixed by the number in pixels  | number |      |
| `isTagDraggable`      | Defines whether it's possible to drag sensor boxes (tags)        | boolean  | true      |
| `isPointerDraggable`  | Defines whether it's possible to drag sensor pointers            | boolean  | true      |
| `onClick`             | Function triggered when user clicks on a sensor box or pointer |`(timeserieId: number) => void`    |         |
| `onLinkClick`         | Function triggered when user clicks on a sensor value link. The link should be enabled with  `linksMap` | `(timeserieId: number, datapoint?: Datapoint) => void`    |         |
| `onSettingsClick`     | Function triggered when user clicks on the settings icon. The icon is shown if this prop is defined. | `(timeserieId: number) => void`    |         |
| `onSensorPositionChange`| Function triggered when either a tag or a pointer has been dragged. | `(timeserieId: number, position: SensorPosition) => void`    |         |
| `strings`              | Object map with strings to customize/localize text in the component    | `{[key: string]: string}`       |             | 

`strings` default value is:
```js
{
  underPercentage: '{{ percent }}% under the set limit of {{ min }}',
  overPercentage: '{{ percent }}% over the set limit of {{ max }}',
}
```

### Types
#### SensorPosition
 This type can be imported from @cognite/gearbox:
```typescript
import { SensorPosition } from '@cognite/gearbox';
```
Definition:
```typescript
interface SensorPosition {
  left: number;
  top: number;
  pointer: {
    left: number;
    top: number;
  };
}
```
The interface defines position for tag and pointer of a sensor relatively to the size of wrapped content provided as `children`. `left` and `top` are coordinates of the tag whereas `pointer` object contains coordinates of the pointer.
These coordinates are float numbers from 0 to 1.
#### SensorMinMaxRange
This interface defines minimum and maximum values for a datapoint of a timeserie.
The type can be imported from @cognite/gearbox:
```typescript
import { SensorMinMaxRange } from '@cognite/gearbox';
```
Definition: 
```typescript
interface SensorMinMaxRange {
  min?: number;
  max?: number;
}
```

#### Datapoint
This interface is provided by [@cognite/sdk](https://github.com/cognitedata/cognitesdk-js):
```typescript
import { Datapoint } from '@cognite/sdk';
```

