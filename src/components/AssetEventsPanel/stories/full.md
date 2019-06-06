 # Asset Events Panel

<!-- STORY -->

### Description:

This component loads a list of events related to the asset and presents it as a table with four columns and pagination. 
Click on a row of the table shows more detailed information about the event in the modal pop-up window.
The component is used as one of the panes in `AssetMeta` component.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetEventsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetEventsPanel assetId={4650652196144007} />;

}
```

#### Available props:

##### Required:

| Property  | Description | Type     | Default |
| --------- | ----------- | -------- | ------- |
| `assetId` | Asset Id    | `number` |         |

##### Optionals:

| Property              | Description                                                                | Type                                          | Default     |
| --------------------- | -------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `columns`             | Array of objects that customize titles of the columns in the table         | `TableColumnType[]`                           |             |
| `customSpinner`       | A custom spinner to be shown in tabs while data is being loaded            | `React.ReactNode`                             |             |
| `styles`              | Object that defines inline CSS styles for inner elements of the component  | `AssetEventsPanelStyles`                      |             |


### Types

#### TableColumnType

Definition:

```typescript
interface TableColumnType {
  title: string;
  dataIndex: string;
  key?: string;

}
```

#### AssetEventsPanelStyles

Definition:

```typescript
interface AssetEventsPanelStyles {
  table?: React.CSSProperties;
  tableRow?: React.CSSProperties;
  tableCell?: React.CSSProperties;
}
```

