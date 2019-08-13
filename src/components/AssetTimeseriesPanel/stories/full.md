 # Asset Timeseries Panel

<!-- STORY -->

### Description:

This component loads meta information about all timeseries related to the asset and shows them in the list.
Each item in the list can be expanded showing description, timeseries chart, current data point and metadata.
The component is used as one of the panes in `AssetMeta` component.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTimeseriesPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetTimeseriesPanel assetId={4650652196144007} />;

}
```

#### Available props:

##### Required:

| Property  | Description | Type     | Default |
| --------- | ----------- | -------- | ------- |
| `assetId` | Asset Id    | `number` |         |

##### Optionals:

| Property              | Description                                                            | Type                                          | Default     |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `queryParams`         | Additional parameters for SDK call. Please notice that `assetId` provided in props will override the one in `queryParams`| `TimeseriesListParams` | `{ limit: 1000 }` |
| `customSpinner`       | A custom spinner to be shown in tabs while data is being loaded        | `React.ReactNode`                             |             |
| `strings`             | Object that defines strings to be passed to the component              | `{ noTimeseriesSign?: string }`               | `'No timeseries linked to this asset'`|
| `styles`              | Object that defines inline CSS styles for inner elements of the component.| `AssetTimeseriesPanelStyles` |             |

#### Optional Props for TimeseriesChartMeta:

This component also takes all optional props of `TimeseriesChartMeta` component. These props are passed to every instance of `TimeseriesChartMeta` in the list of timeseries. See `TimeseriesChartMeta` component for more details.

#### TimeseriesListParams

This type can be imported from `@cognite/sdk`:

```typescript
import { TimeseriesListParams } from `@cognite/sdk`;
```
#### AssetTimeseriesPanelStyles

This interface defines inline CSS styles for inner elements of `AssetTimeseriesPanel` component.
The type can be imported from `@cognite/gearbox`:

```typescript
import { AssetTimeseriesPanelStyles } from '@cognite/gearbox';
```

Definition:
```typescript
interface AssetTimeseriesPanelStyles {
  wrapper?: React.CSSProperties;
  timeseriesContainer?: React.CSSProperties;
}
```
See more details in AssetMeta component documentation.
