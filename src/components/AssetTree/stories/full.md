# Asset Tree

<!-- STORY -->

#### Description:

Visualize parent-child relationship of assets in a tree structure. It will initially fetch all available root assets from the SDK. When a node is expanded, the children will be fetched dynamically

#### Usage:

```typescript jsx
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

| Property              | Description                                 | Type                        | Default |
| --------------------- | ------------------------------------------- | --------------------------- | ------- |
| `onSelect`            | Triggers when a node is selected            | `(onSelect: OnSelectAssetTreeParams) => void` |         |
| `defaultExpandedKeys` | List of node ids to be expanded by default  | `number[]`                  | [] |


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
