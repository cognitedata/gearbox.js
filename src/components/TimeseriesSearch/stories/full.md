## Timeseries Search 

<!-- STORY -->

### Description:

This component searches for timeseries by name. Search results will be shown in a list. Each result have a checkbox for selection, and all selected timeseries are shown above the search bar. Selected timeseries can be removed by clicking the cross on the selected row.
The component requires only `onTimeserieSelectionChange`prop which is called when the selection changes. It is called with two parameters: the current list of selected ids, and the last added/removed timeseries.

#### Usage

```typescript jsx
import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { Timeseries} from '@cognite/sdk';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: Timeseries) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
  );
  
}
```

#### Available props:

##### Required:

| Property                     | Description | Type     | Default     |
| ---------------------------- | ----------- | -------- | ----------- |
| `onTimeserieSelectionChange` | Callback function called when the selection changes. Called with two parameters: the current list of selected ids and the last added/removed timeseries   | `(newTimeseriesIds: number[], selectedTimeseries: Timeseries) => void` |          |

##### Optional:

| Property             | Description                                                                  | Type                                      | Default     |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------| ----------- |
| `selectedTimeseries` | List of preselected timeseries                                               | `number[]`                                | `[]`        |
| `rootAsset`          | The selected root asset id. `undefined` will select all                      | `number`                                  |             |
| `single`             | Removes the checkboxes from search result and will only callback with one id | `boolean`                                 | `false`     |
| `hideSelected`       | Hides the row with selected timeseries above the search bar                  | `boolean`                                 | `false`     |
| `allowStrings`       | Allows the user to select search results that are strings                    | `boolean`                                 | `false`     |
| `filterRule`         | Custom rule to filter search results                                         | `(timeseries: Timeseries) => boolean`     |             |
| `onError`            | Function called on fetch timeseries error                                    | `(error: Error) => void`                  |             |

### Types

### Timeseries

This type describes what the cognite API returns when fetching timeseries.
It can be imported from `@cognite/sdk`.
Documentation can be found at https://js-sdk-docs.cogniteapp.com/interfaces/timeseries.html.