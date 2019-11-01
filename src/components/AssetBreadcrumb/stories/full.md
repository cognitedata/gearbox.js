# Asset Breadcrumb

<!-- STORY -->

### Description:

This component renders breadcrumb for assets chain, that represents path from root asset to provided asset.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetBreadcrumb } from '@cognite/gearbox';

function ExampleComponent(props) {
  return <AssetBreadcrumb assetId={4518112062673878} />;

}
```

#### Available props:

##### Required:

| Property  | Description | Type     | Default |
| --------- | ----------- | -------- | ------- |
| `assetId` | Asset Id    | `number` |         |

##### Optionals:

| Property            | Description                                                                                                                                                                                              | Type                                           | Default |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------- |
| `maxLength`         | Maximal number of assets to be displayed. If length of the asset chain bigger than `maxLength` value, asset chain will be shrunk to root element plus `maxLength` - 1 number of last elements in a chain | `number`                                       | 7       |
| `renderItem`        | Function, that can be used for custom rendering of asset in a breadcrumb                                                                                                                                 | `(asset: Asset, depth: number) => JSX.Element` |         |
| `onBreadcrumbClick` | Callback, that triggers on a click action on asset in a breadcrumb. It's only available in case of default asset rendering in a breadcrumb                                                               | `(asset: Asset, depth: number) => void`        |         |

### Types

### Asset

`Asset` type can be imported from `@cognite/sdk`:

```typescript
import { Asset } from '@cognite/sdk';
```
