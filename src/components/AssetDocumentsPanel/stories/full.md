 # Asset Documents Panel

<!-- STORY -->

### Description:

This component loads list of documents related to the asset and presents it in the list of categories.
Each item in the list can be expanded showing list of files.
The component is used as one of the panes in `AssetMeta` component.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetDocumentsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetDocumentsPanel assetId={4650652196144007} />;

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
| `queryParams`         | Additional parameters for SDK call. Please notice that `assetId` provided in props will override the one in `queryParams`| `FileListParams` | `{ limit: 1000 }` |
| `handleDocumentClick` | Callback function triggered when user clicks on a file (document)      | `OnDocumentClick`                             |             |
| `collapseProps`       | Object with props to be passed to `atnd` `Collapse` component          | `CollapseProps`                               |             |
| `categoryPriorityList`| List of categories codes to be shown on the top of the list. Categories "P&ID" and "Logic Diagrams" are prioritized by default.| `string[]`                                    | `['XB', 'XL']`|
| `unknownCategoryName` | Name for the category that includes all files with undefined category  | `string`                                      | `'Unknown document type'` |
| `docTypes`            | Object map used to show custom category names                          | `{[categoryCode: string]: string}`            |             |
| `noDocumentsSign`     | Text to be shown if no documents have been found for the asset         | `string`                                      | `'No documents linked to this asset'`  |
| `documentRenderer`    | Custom render functions for documents                                  | `string`                                      |`DocumentRenderer` |
| `customCategorySort`  | Sort function used to sort categories after priority categories        | `(a: string, b: string) => number`            |             |
| `customSpinner`       | A custom spinner to be shown in tabs while data is being loaded        | `React.ReactNode`                             |             |
| `styles`              | Object that defines inline CSS styles for inner elements of the component  | `AssetDocumentsPanelStyles`                   |             |


### Types

#### FileListParams

This type can be imported from `@cognite/sdk`:

```typescript
import { FileListParams } from `@cognite/sdk`;
```

#### OnDocumentClick

Definition:

```typescript
type OnDocumentClick = (
  document: Document,
  category: string,
  description: string
) => void;
```

#### CollapseProps
This type can be imported from `antd`:

```typescript
import { CollapseProps } from 'antd/lib/collapse';
```

#### DocumentRenderer

Definition:

```typescript
import { File } from `@cognite/sdk`;

type DocumentRenderer = (
  document: File,
  i: number,
  documents: File[]

) => React.ReactNode;

```

#### AssetDocumentsPanelStyles

This interface defines inline CSS styles for inner elements of `AssetDocumentsPanel` component.
The type can be imported from `@cognite/gearbox`:

```typescript
import { AssetDocumentsPanelStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface DocumentTableStyles {
  wrapper?: React.CSSProperties;
  fileContainer?: React.CSSProperties;
  fileLink?: React.CSSProperties;
  fileTitle?: React.CSSProperties;
}
```
See more details in Asset Meta component documentation.
