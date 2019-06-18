## Timeseries Search 

<!-- STORY -->

### Description:

This component searches for timeseries by name. Search results will be shown in a list. Each result have a checkbox for selection, and all selected timeseries are shown above the search bar. Selected timeseries can be removed by clicking the cross on the selected row.
The component requires only `onTimeserieSelectionChange`prop which is called when the selection changes. It is called with two parameters: the current list of selected ids, and the last added/removed timeseries.

#### Usage

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesSearch } from '@cognite/gearbox';
import { GetTimeSeriesMetadataDTO } from '@cognite/sdk/dist/src/types/types';

const onTimeserieSelectionChange = (newTimeseriesIds: number[], selectedTimeseries: GetTimeSeriesMetadataDTO) => {}
function ExampleComponent(props) {
  return (
    <TimeseriesSearch
      onTimeserieSelectionChange={onTimeserieSelectionChange}
  );
  
}
```

#### Info:
You can search for `${names}`

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
| `rootAssetSelect`    | Enable/disable RootAssetSelect component                                     | `boolean`                                 | `false`     |
| `single`             | Removes the checkboxes from search result and will only callback with one id | `boolean`                                 | `false`     |
| `hideSelected`       | Hides the row with selected timeseries above the search bar                  | `boolean`                                 | `false`     |
| `allowStrings`       | Allows the user to select search results that are strings                    | `boolean`                                 | `false`     |
| `filterRule`         | Custom rule to filter search results                                         | `(timeseries: GetTimeSeriesMetadataDTO) => boolean`     |             |
| `onError`            | Function called on fetch timeseries error                                    | `(error: Error) => void`                  |             |
| `styles`             | Custom styles for the component                                              | `TimeseriesSearchStyles`                  |             |

### Types

### GetTimeSeriesMetadataDTO

This type describes what the cognite API returns when fetching timeseries.
It can be imported from `@cognite/sdk/dist/src/types/types`.
Documentation can be found at https://js-sdk-docs.cogniteapp.com/interfaces/timeseries.html.

### TimeseriesSearchStyles

This interface defines inline CSS styles for inner elements of `TimeseriesSearch` component.

The type can be imported from `@cognite/gearbox`:

```typescript
import { TimeseriesSearchStyles } from '@cognite/gearbox';
```

Definition:

```typescript
export interface TimeseriesSearchStyles {
  buttonRow?: React.CSSProperties;
  list?: React.CSSProperties;
  selectAllButton?: React.CSSProperties;
  selectNoneButton?: React.CSSProperties;
}
```

See more details in `Custom styles` example.
