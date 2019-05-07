# Event Preview

<!-- STORY -->

### Description:

`EventPreview` component fetches information about an event and presents it as a block element with following items: event type / event subtype,
event description, event start datetime and end datetime, number of elements in metadata (additional pieces of data), button to explore 
additional event details. The component requires only `eventId` that is numerical ID of an event. While loading an event the component 
shows loading spinner.

#### Usage:

```typescript jsx
import React from 'react';
import { Event } from '@cognite/sdk';
import { EventPreview } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onShowDetails = (event: Event) = {};

  return (
    <EventPreview 
      eventId={4650652196144007}
      onShowDetails={onShowDetails} 
    />
  );

}
```

#### Available props:

##### Required:

| Property  | Description | Type     | Default |
| --------- | ----------- | -------- | ------- |
| `eventId` | Event Id    | `number` |         |

##### Optionals:

| Property            | Description                                                            | Type                                          | Default     |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `hideProperties`    | List of event properties to be hidden. Possible values: `type`, `subtype`, `description`, `startTime`, `endTime`, `metadata`| `Array<keyof Event>`                          | []          |
| `hideLoadingSpinner`| Defines whether to hide the loading spinner                            | `boolean`                       |             | false       |
| `onShowDetails`     | Function triggered when user clicks on the 'Explore event details' button. If the function is not provided the button will not be rendered. | `(event: Event) => void`     |             |             |
| `strings`           | Object map with strings to customize/localize text in the component    | `{[key: string]: string}`       |             |             |

`strings` default value is:
```js
{
  noDescription: 'No description',
  start: 'Start',
  end: 'End',
  noStartTime: 'Unknown',
  noEndTime: 'Ongoing',
  details: 'Explore event details',
  metadataSummary: 'Contains {{count}} additional pieces of data',
}
```


### Types

#### Event
`Event` type can be imported from @cognite/sdk:

```typescript
import { Event } from '@cognite/sdk';
```

