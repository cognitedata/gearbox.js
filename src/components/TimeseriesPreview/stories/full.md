# Timeseries Preview

<!-- STORY -->

#### Description:

Component displays data related to provided `timeseriesId` with latest datapoint available. Latest datapoint value is updated with interval provided via `updateInterval` prop.

Component has embedded logic for fetching timeseries data and latest datapoint available for it. To make it work properly, component
has to be wrapped into `ClientSDKProvider` component with defined client SDK instance. Fetching logic
also can be redefined via `retrieveTimeseries` and `retrieveLatestDatapoint` props to retrieve timeseries data and latest datapoint respectively.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <TimeseriesPreview timeseriesId={41852231325889} />;

}
```

#### Available props:

##### Required:

| Property       | Description   | Type     | Default |
| -------------- | ------------- | -------- | ------- |
| `timeseriesId` | Timeseries id | `number` |         |

##### Optionals:

| Property                  | Description                                                                                                | Type                                                         | Default                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------ |
| `color`                   | Rendered as a background color for the left side of the component                                          | `string`                                                     | `#6c65ee`                |
| `dateFormat`              | Defines [date format](https://momentjs.com/docs/#/displaying/format/) to be applied on datapoint timestamp | `string`                                                     | `DD MMM YYYY - HH:mm:ss` |
| `updateInterval`          | Refresh latest datapoint interval in ms                                                                    | `number`                                                     | `5000`                   |
| `valueToDisplay`          | Datapoint to be rendered instead of latest datapoint. Pause fetching latest datapoint if provided            | `GetDoubleDatapoint \| GetStringDatapoint`
| `nameFormatter`              | Function, that formats timeseries name value to be displayed          | `(name?: string) => string`
| `descriptionFormatter`       | Function that formats timeseries description value to be displayed          | `(description?: string) => string`                   |                          |
| `dropdown`                | Configuration, that describes dropdown menu to be rendered                                                 | `TimeseriesPreviewMenuConfig`                                |                          |
| `retrieveTimeseries`      | Function that can be used to replace embedded timeseries fetching logic                                 | `FetchTimeserieCall`                                         |                          |
| `retrieveLatestDatapoint` | Function that can be used to replace embedded latest datapoint fetching                                 | `FetchLatestDatapointCall`                                   |                          |
| `formatDisplayValue`      | Function that gives ability to format rendered value of latest or provided datapoint                       | `(value: string \| number \| undefined) => string \| number` |                          |
| `onToggleVisibility`        | Callback that triggers in case of click on visibility icon                                                 | `(timeseries: GetTimeSeriesMetadataDTO) => void`             |                          |
| `styles`                  | Styles, that can be provided to customize component view                                                   | `TimeseriesPreviewStyles`                                    |                          |
| `strings`                 | Strings, that can be customized                                                                            | `PureObject`                                                 |                          |

#### Imported Types:

`GetDoubleDatapoint, GetStringDatapoint, GetTimeSeriesMetadataDTO` types can be imported from `@cognite/sdk`:

```typescript
import {
  GetDoubleDatapoint,
  GetStringDatapoint,
  GetTimeSeriesMetadataDTO,
} from '@cognite/sdk';
```

#### Exported types:

```typescript
import {
  DatapointsGetDatapoint,
  GetTimeSeriesMetadataDTO,
  InternalId,
} from '@cognite/sdk';
import { PureObject } from '@cognite/gearbox';

interface TimeseriesPreviewMenuConfig {
  config: PureObject;
  onClick: (key: string, timeseries: GetTimeSeriesMetadataDTO) => void;
}

interface TimeseriesPreviewStyles {
  wrapper?: React.CSSProperties;
  card?: React.CSSProperties;
  leftSide?: React.CSSProperties;
  rightSide?: React.CSSProperties;
  tagName?: React.CSSProperties;
  description?: React.CSSProperties;
  value?: React.CSSProperties;
  date?: React.CSSProperties;
  dropdown?: DropdownMenuStyles;
}

interface DropdownMenuStyles {
  menu?: React.CSSProperties;
  item?: React.CSSProperties;
}

type FetchTimeserieCall = (
  timeseriesId: InternalId
) => Promise<GetTimeSeriesMetadataDTO[]>;

type FetchLatestDatapointCall = (
  timeseriesId: InternalId
) => Promise<DatapointsGetDatapoint[]>;
```

#### Default strings

```typescript
const defaultStrings = {
  noData: 'No Data',
};
```
