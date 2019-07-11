# Node Tree
<!-- STORY -->

#### Description:

Visualize parent-child relationship of 3D nodes in a tree structure. It will initially fetch all available root from a model. When a node is expanded, its children will be fetched dynamically. It behaves the same with Asset Tree.

To retrieve a tree you need to provide:

- `modelId` – you can find it using `sdk.ThreeD.listModels()` call
- `revisionId` – you can find it via `sdk.ThreeD.listRevisions(modelID)` call

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { NodeTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <NodeTree modelId = {0} revisionId = {0}/>
  );

}
```
#### Available props:

##### Required:

| Property     | Description              | Type     | Default |
| ------------ | ------------------------ | -------- | ------- |
| `modelId`    | model ID number          | `number` |    0    |
| `revisionId` | model revision ID number | `number` |    0    |

#### Optional:

| Property              | Description                                 | Type                        | Default |
| --------------------- | ------------------------------------------- | --------------------------- | ------- |
| `onSelect`            | Triggers when a node is selected            | `(onSelect: OnSelectNodeTreeParams) => void` | `onSelect:  (selectedNode : OnSelectNodeTreeParams) => selectedNode.key`|
| `defaultExpandedKeys` | List of node ids to be expanded by default  | `number[]`                  | [ ] |
| `styles`              | Object that defines inline CSS styles for inner elements of the component.| `NodeTreeStyles` |  |


### Types

#### OnSelectNodeTreeParams

This type describes the parameters the `onSelect` function is called with.
The type can be imported from @cognite/gearbox:

```typescript
import { OnSelectNodeTreeParams } from '@cognite/gearbox';
```

Definition:

```typescript
interface OnSelectAssetTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Node;
}

```

#### Node

The Node type documentation can be found at https://js-sdk-docs.cogniteapp.com/interfaces/node.html

#### NodeTreeStyles
This interface defines inline CSS styles for inner elements of `NodeTree` component.
You can override styles of following blocks:
<br>
<img src="asset_tree/styling_schema.jpg" alt="List Styling" width="350px"><br><br>


The type can be imported from `@cognite/gearbox`:

```typescript
import { NodeTreeStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface NodeTreeStyles {
  list?: React.CSSProperties;
}
```

