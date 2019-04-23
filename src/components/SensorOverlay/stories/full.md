# Sensor Overlay

<!-- STORY -->

### Description:

Renders set of latest timeseries (sensors) data. Each sensor is represented as a draggable box (tag) connected by a line with round pointer. All sensor items are drawn on top of wrapped content.
This component can be used as a container of an infographic image for displaying real-time sensors data.
The height of SensorOverlay component is defined by content provided in `children`,
the width takes is `100%` unless `fixedWidth` is provided. This component requires a list of timeserie IDs, once they are passed via
`timeserieIds` prop it fetches meta information (name, description, etc) for all timeseries in the list and then constantly fetches latest data (Datapoint) for each timeserie with interval provided in `refreshInterval` (5 seconds by default).

#### Usage:

```typescript jsx
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
| `defaultPositionMap`  | Object map that defines position of newly added sensors in `timeserieIds`. The map doesn't affect position of previously added or dragged sensors         | { [timeserieId: number]: SensorPosition }  |          |
| `skickyMap`           | Object map that defines which timeseries will show tooltips with name and description without mouse hovering  | { [timeserieId: number]: boolean } |       |
| `linksMap`            | Object map that defines if it's needed to wrap timeserie values in anchor tag `<a>`, works in conjunction with `onLinkClick` | { [timeserieId: number]: boolean } |       |
| `fixedWidth`          | By default SensorOverlay takes 100% width in current block context but if `fixedWidth` is given the width will be fixed by the number in pixels  | number |      |
| `isTagDraggable`      | Defines whether it's possible to drag sensor boxes (tags)        | boolean  | true      |
| `isPointerDraggable`  | Defines whether it's possible to drag sensor pointers            | boolean  | true      |
| `onClick`             | Function triggered when user clicks on a sensor box or pointer |`(timeserieId: number) => void`    |         |
| `onLinkClick`         | Function triggered when user clicks on a sensor value link. The link should be enabled with  `linksMap` | `(timeserieId: number, datapoint?: Datapoint) => void`    |         |
| `onSettingsClick`     | Function triggered when user clicks on the settings icon. The icon is shown if this prop is defined. | `(timeserieId: number) => void`    |         |
| `onSensorPositionChange`| Function triggered when user sensor's tag or pointer has been dragged. | `(timeserieId: number, position: SensorPosition) => void`    |         |

### Types
#### SensorPosition
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
`left` and `top` are coordinates of sensor tag relative to the size of wrapped content provided as `children`. 
`pointer` object defines coordinates of sensor pointer that is a small circle connected with tag by line.
These coordinates are float numbers from 0 to 1.
#### Datapoint
This interface is provided by [@cognite/sdk](https://github.com/cognitedata/cognitesdk-js).

