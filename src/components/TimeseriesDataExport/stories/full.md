# Timeseries Data Export

<!-- STORY -->

#### Description:

Component allows to export CSV data for provided timeseries in selected timerange with defined granularity.

Component based on antd modal component with form, where user can define all configurations for CSV export.

Component has embedded logic for fetching timeseries data and generating CSV file. To make it work properly, component
has to be wrapped into `ClientSDKProvider` component with defined client SDK instance. Fetching logic
also can be redefined via `retrieveTimeseries` and `fetchCSV` props.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesDataExport } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <TimeseriesDataExport
      visible={true}
      timeseriesIds={[41852231325889]}
      granularity={'2m'}
      defaultTimeRange={[1567321800000, 1567408200000]}
    />
  );

}
```

#### Available props:

##### Required:

| Property       | Description                                                                           | Type       | Default |
| -------------- | ------------------------------------------------------------------------------------- | ---------- | ------- |
| `timeseriesIds` | Array of timeserie ids                                                                | `number[]` |         |
| `granularity`  | String, that represents initial granularity (ex. 2m, 15s, 1h) to be displayed in form | `string`   |         |
| `defaultTimeRange` | Array with start - end timestamp values for initial time range                                  | `number[]` |         |
| `visible`      | Flag that shows/hides modal with form                                                 | `boolean`  |         |

##### Optionals:

| Property             | Description                                                                                                                   | Type                  | Default |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| `modalWidth`         | Width of modal window                                                                                                         | `number`              | `600`   |
| `cellLimit`          | Limit of cells for generated CSV documents, can't be greater then 10000                                                       | `number`              | `10000` |
| `downloadAsSvg`      | Function, that triggers on Download SVG button click. Button appears if this function is defined                              | `() => void`          |         |
| `fetchCSV`           | Async function that return CSV-kind string that will be a source for CSV file                                                 | `FetchCSVCall`        |         |
| `retrieveTimeseries` | Async function that fetches data about timeseries                                                                             | `FetchTimeseriesCall` |         |
| `hideModal`          | Callback that handles modal close action                                                                                      | `() => void`          |         |
| `formItemLayout`     | Object that configures form layout based on [antd rules](https://ant.design/components/form/#Form.Item) for label and wrapper | `FormItemLayout`      |         |
| `onSuccess`          | Callback that triggers after success CSV file generation                                                                      | `() => void`          |         |
| `onError`            | Callback that triggers in case of API call errors                                                                             | `(error) => void`     |         |
| `strings`            | Strings, that can be customized                                                                                               | `PureObject`          |         |

#### Types:

#### `FetchCSVCall`

The type can be imported from `@cognite/gearbox`:

```typescript
import { FetchCSVCall } from '@cognite/gearbox';
```

Definition:

```typescript
import { DatapointsMultiQuery, Aggregate } from '@cognite/sdk';

interface CsvParseOptions {
  aggregate: Aggregate;
  delimiter: ',' | '|' | '\t';
  readableDate: boolean;
  granularity: string;
}

type FetchCSVCall = (
  request: DatapointsMultiQuery,
  opts: CsvParseOptions
) => Promise<string>;
```

#### `FetchTimeseriesCall`

The type can be imported from `@cognite/gearbox`:

```typescript
import { FetchTimeseriesCall } from '@cognite/gearbox';
```

Definition:

```typescript
import { InternalId, TimeSeries } from '@cognite/sdk';

type FetchTimeseriesCall = (
  ids: InternalId[]
) => Promise<TimeSeries[]>;
```

#### Default strings

```typescript
const defaultStrings: PureObject = {
  title: 'Export chart data',
  labelRange: 'Range',
  labelGranularity: 'Label Granularity',
  labelGranularityHelp: 'Example inputs: 15s, 1m, 5h, 2d',
  formatTimestamp: 'Format timestamp?',
  formatTimestampHelp: 'e.g. 2018-04-02 12:20:20',
  delimiterLabel: 'Select delimiter',
  delimiterHelp: 'The character that will separate your data fields',
  csvDownload: 'Download as CSV',
  csvDownloadInProgress: 'Download as CSV',
  closeBtn: 'Close',
  imageDownloadLabel: 'Image download',
  imageDownloadBtn: 'Download as SVG',
  cellLimitErr:
    'You hit the limit of {{ cellLimit }} datapoints - some data may be omitted',
};
```
