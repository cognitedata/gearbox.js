## Description List 

<!-- STORY -->

### Description

This component displays an object in a table layout.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { DescriptionList } from '@cognite/gearbox';

const metadata = {
  SOURCE_DB: 'workmate',
  SOURCE_TABLE: 'wmate_dba.wmt_location',
  WMT_LOCATION_ID: '1004',
  WMT_LOCATION_WORKSTART: '1999-09-01 07:00:00',
  latestUpdateTimeSource: '1552471210000',
}

function ExampleComponent(props) {
  return (
    <DescriptionList 
      valueSet={metadata} 
    />
  );
  
}
```

#### Available props:

##### Required:

No required props

##### Optionals:

| Property      | Description                                                                                    | Type                                                  | Default |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------- |
| `valueSet`    | An object with properties to render                                                            | `{ [name: string] : any }`                                              | {}      |
| `toCategory`          | A custom categorization function (e.g. to collapse specific values).    | `(name: string) => string \| undefined`       |             |
| `categoryPriorityList`| Categories to display on top. Can be used for sorting as well          | `string[]`                                    |      []     |
| `unknownCategoryName` | A category name for uncategorised items.                               | `string`                                      | "Uncategorised"|
| `expandedCategories`  | Category names to be expanded by default.                              | `string[]`                                    | Top category in the list |
| `description` | An object with two properties `descriptionId` and `descriptionText` to display above the table | `{ descriptionId: string; descriptionText: string; }` | {}      |

