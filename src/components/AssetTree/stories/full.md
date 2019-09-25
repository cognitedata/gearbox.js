# Asset Tree

<!-- STORY -->

#### Description:

Visualize parent-child relationship of assets in a tree structure. It will initially fetch all available root assets from the SDK. When a node is expanded, the children will be fetched dynamically

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <AssetTree />
  );

}
```

#### Available props:
##### Required:

No required props

#### Optional:

| Property              | Description                                 | Type                        | Default           |
| --------------------- | ------------------------------------------- | --------------------------- | -------           |
| `onSelect`            | Triggers when a node is selected            | `(onSelect: OnSelectAssetTreeParams) => void` | |
| `defaultExpandedKeys` | List of node ids to be expanded by default  | `number[]`                  | [ ]               |
| `styles`              | Object that defines inline CSS styles for inner elements of the component.| `AssetTreeStyles` |  |


### Types

#### OnSelectAssetTreeParams

This type describes the parameters the `onSelect` function is called with.
The type can be imported from @cognite/gearbox:

```typescript
import { OnSelectAssetTreeParams } from '@cognite/gearbox';
```

Definition:

```typescript
interface OnSelectAssetTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Asset;
}

```

#### Asset

The Asset type documentation can be found at https://js-sdk-docs.cogniteapp.com/interfaces/asset.html

#### AssetTreeStyles
This interface defines inline CSS styles for inner elements of `AssetTree` component.
You can override styles of following blocks:
<br>
<img src="asset_tree/styling_schema.jpg" alt="List Styling" width="350px"><br><br>


The type can be imported from `@cognite/gearbox`:

```typescript
import { AssetTreeStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface AssetTreeStyles {
  list?: React.CSSProperties;
}
```

See more details in `Custom Styles` example.
