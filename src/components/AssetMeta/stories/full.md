# Asset Meta

<!-- STORY -->

### Description:

This component loads meta information for an asset and presents in four tabbed panes: "Details", "Timeseries", "Documents" and "Events".
First pane "Details" shows metadata about the asset itself as a table with two columns containing key-value pairs.
Second pane "Timeseries" shows list of timeseries associated with the asset and each item in the list can be expanded showing timeseries
chart, current data point (sensor value), meta data of the timeseries, etc.
Third pane "Documents" presents uploaded files related to the asset. Fourth pane "Events" shows a list of events related to the asset.
The component requires only `assetId` prop and once passed it makes four API requests for asset metadata, timeseries, documents, and events.
In case if some of the panes are not necessary it can be disabled by `hidePanels` prop.


If you need to use one of these four panes separately without tabs please see following components: `AssetDetailsPanel`, `AssetTimeseriesPanel`, `AssetDocumentsPanel` and `AssetEventsPanel`.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetMeta assetId={4650652196144007} />;

}
```

#### Available props:

##### Required:

| Property  | Description | Type     | Default |
| --------- | ----------- | -------- | ------- |
| `assetId` | Asset Id    | `number` |         |

##### Optionals:

| Property       | Description                                                            | Type                                          | Default     |
| -------------- | ---------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `hidePanels`   | List of panes to be hidden                                             | `Array<'details' \| 'documents' \| 'events'>` |             |
| `tab`          | Defines pane that will be activated once the data has been loaded      | `'details' \| 'documents' \| 'events'`        | `'details'` |
| `onPaneChange` | Function triggered when a user changes panes                           | `(tab: string) => void`                       |             |
| `detailsProps` | Object passed as props to inner component that presents details pane   | `MetaAssetDetailsProps`                       |             |
| `timeseriesProps`| Object passed as props to inner component that presents timeseries pane | `MetaTimeseriesProps`                      |             |
| `docsProps`    | Object passed as props to inner component that presents documents pane | `MetaDocProps`                                |             |
| `eventProps`   | Object passed as props to inner component that presents events pane    | `MetaEventsProps`                             |             |
| `customSpinner`| A custom spinner to be shown in tabs while data is being loaded        | `React.ReactNode`                             |             |
| `styles`       | Object that defines inline CSS styles for inner elements of the component.| `AssetMetaStyles`, `AssetTimeseriesPanelStyles`, `AssetDocumentsPanelStyles`, `AssetEventsPanelStyles`|             |

### Types

### MetaAssetDetailsProps
The object that customizes the appearance of "Details" pane. All metadata properties will be hidden inside "collapse" component when optional property function  `toCategory` is passed. All uncategorized properties will appear under "Uncategorised" label, or the name specified with `unknownCategoryName`. See `DescriptionList` component for more details.
`MetaAssetDetailsProps` type can be imported from @cognite/gearbox:

```typescript
import { MetaAssetDetailsProps } from '@cognite/gearbox';
```

Definition:

```typescript
export interface MetaAssetDetailsProps {
  toCategory?: (name: string) => string | undefined;
  categoryPriorityList?: string[];
  unknownCategoryName?: string;
  expandedCategories?: string[];
}

```

### MetaTimeseriesProps
The object that customizes the appearance of "Timeseries" pane. Property `strings` defines text literals for the inner component that represents a list of timeseries and in particular `noTimeseriesSign` property defines a custom message to be shown if no timeseries were found for the asset.
Other properties define appearance of `TimeseriesChartMeta` component which is shown if any entry in the list was expanded. See `TimeseriesChartMeta` component for more details.
`MetaTimeseriesProps` type can be imported from @cognite/gearbox:

```typescript
import { MetaTimeseriesProps } from '@cognite/gearbox';
```

Definition:

```typescript
interface MetaTimeseriesProps {
  strings?: {
    noTimeseriesSign?: string;
  };
  liveUpdate?: boolean;
  updateIntervalMillis?: number;
  defaultTimePeriod?: TimeseriesChartMetaPeriod;
  defaultBasePeriod?: {
    startTime: number;
    endTime: number;
  };
  showDescription?: boolean;
  showPeriods?: boolean;
  showChart?: boolean;
  showDatapoint?: boolean;
  showMetadata?: boolean;
}

type TimeseriesChartMetaPeriod =  'lastYear' | 'lastMonth' | 'lastWeek' | 'lastDay' | 'lastHour' | 'last15minutes';

```

#### MetaDocProps
This prop customizes the appearance of "Documents" pane.
It also contains a handler triggered when a user clicks on a certain document.
Please notice that document categories "P&ID" and "Logic diagrams" are prioritized by default
so that these categories always appear on top of the list unless `categoryPriorityList`
is provided with a list of prioritized category codes. The rest of categories are sorted alphabetically,
but if `customCategorySort` is provided this function will be used for sorting none prioritized categories.
Priority categories are delimited from regular categories by gray line.
`MetaDocProps` type can be imported from @cognite/gearbox:

```typescript
import { MetaDocProps } from '@cognite/gearbox';
```

Definition:

```typescript
import { CollapseProps } from 'antd/lib/collapse';
import { FilesMetadata as Document } from '@cognite/sdk';

interface MetaDocProps {
  handleDocumentClick?: OnDocumentClick;
  collapseProps?: CollapseProps;
  categoryPriorityList?: string[];
  unknownCategoryName?: string;
  documentTitleField?: string;
  documentTypeField?: string;
  docTypes?: JsonDocTypes;
  noDocumentsSign?: string;
  documentRenderer?: DocumentRenderer;
  customCategorySort?: (a: string, b: string) => number;
}

type OnDocumentClick = (
  document: Document,
  category: string,
  description: string
) => void;

type DocumentRenderer = (
  document: Document,
  i: number,
  documents: Document[]
) => React.ReactNode;

interface JsonDocTypes {
  [s: string]: string;

}

```

#### MetaEventsProps
This prop is supposed to customize appearance of "Events" pane.
The type can be imported from @cognite/gearbox:

```typescript
import { MetaEventsProps } from '@cognite/gearbox';
```

Definition:

```typescript
interface MetaEventsProps extends TableDesignType {
  columns?: TableColumnType[];
}

interface TableDesignType {
  pagination?: {
    pageSize?: number;
    position?: 'top' | 'bottom' | 'both';
    showSizeChanger?: boolean;
  };
  scroll?: {
    y?: string;
    x?: string;
  };
  bordered?: boolean;
  showHeader?: boolean;
  style?: object;
}

interface TableColumnType {
  title: string;
  dataIndex: string;
  key?: string;

}

```
#### AssetMetaStyles
This interface defines inline CSS styles for inner elements of `AssetMeta` component.
You can override styles of following blocks:
<p>Details tab:</p>
<img src="asset_meta/styling_schema1.jpg" alt="Tenant Styling" width="700px"><br><br>
<p>Timeseries tab:</p>
<img src="asset_meta/styling_schema4.jpg" alt="Tenant Styling" width="700px"><br><br>
<p>Documents tab:</p>
<img src="asset_meta/styling_schema2.jpg" alt="Tenant Styling" width="700px"><br><br>
<p>Events tab:</p>
<img src="asset_meta/styling_schema3.jpg" alt="Tenant Styling" width="700px"><br><br>

The type can be imported from `@cognite/gearbox`:

```typescript
import { AssetMetaStyles, AssetTimeseriesPanelStyles, AssetDocumentsPanelStyles, AssetEventsPanelStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface AssetMetaStyles {
  header?: React.CSSProperties;
  emptyTab?: React.CSSProperties;
  details?: React.CSSProperties;
  timeseries?: AssetTimeseriesPanelStyles;
  documents?: AssetDocumentsPanelStyles;
  events?: AssetEventsPanelStyles;
}
```
```typescript
interface AssetTimeseriesPanelStyles {
  wrapper?: React.CSSProperties;
  timeseriesContainer?: React.CSSProperties;
}
```
```typescript
interface AssetDocumentsPanelStyles {
  wrapper?: React.CSSProperties;
  fileContainer?: React.CSSProperties;
  fileLink?: React.CSSProperties;
  fileTitle?: React.CSSProperties;
}
```
```typescript
interface AssetEventsPanelStyles {
  table?: React.CSSProperties;
  tableRow?: React.CSSProperties;
  tableCell?: React.CSSProperties;
}
```

See more details in `Custom Styles` example.
