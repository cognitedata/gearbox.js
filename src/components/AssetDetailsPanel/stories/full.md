 # Asset Details Panel

<!-- STORY -->

### Description:

This component loads meta information for an asset and presents it as a key/value list in a table with two columns.
The component is used as one of the panes in `AssetMeta` component.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetDetailsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetDetailsPanel assetId={4650652196144007} />;

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
| `customSpinner`| A custom spinner to be shown in tabs while data is being loaded        | `React.ReactNode`                             |             |
| `styles`       | Object that defines inline CSS style for container of the table.       | `React.CSSProperties`                         |             |

