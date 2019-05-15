# Asset Meta

<!-- STORY -->

### Description:

This component loads meta information for an asset and presents in three tabbed panes: "Details", "Documents" and "Events".
First pane "Details" shows metadata about the asset itself as a table with two columns containing key-value pairs.
Second pane "Documents" presents uploaded files related to the asset. Third pane "Events" shows a list of events related to the asset.
The component requires only `assetId` prop and once passed it makes three API requests for asset metadata, documents, and events.
In case if some of the panes are not necessary it can be disabled by `hidePanels` prop.

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
| `docsProps`    | Object passed as props to inner component that presents documents pane | `MetaDocProps`                                |             |
| `eventProps`   | Object passed as props to inner component that presents events pane    | `MetaEventsProps`                             |             |

### Types

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
import { File as Document } from '@cognite/sdk';
 
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
