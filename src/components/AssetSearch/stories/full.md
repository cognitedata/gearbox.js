# Asset Search

<!-- STORY -->

#### Description:

Using for assets search via name property.

#### Usage:

```typescript jsx
import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

function ExampleComponent(props) {
  const onLiveSearchSelect = (item: Asset): void => {};

  return (
    <AssetSearch onLiveSearchSelect={onLiveSearchSelect} />
  );

}
```

#### Available props:
##### Required:

| Property              | Description                                                        | Type                  | Default |
| --------------------- | ------------------------------------------------------------------ | --------------------- | ------- |
| `onLiveSearchSelect`  | Trigger after selecting on of items from live search results list  | `(asset: sdk.Asset) => void;`            |         |

##### Optionals:

| Property              | Description                                 | Type                        | Default |
| --------------------- | ------------------------------------------- | --------------------------- | ------- |
| `onError`             | Triggers when search error occurs           | `(error: any) => void`                  |         |
| `strings`             | Object of strings to be placed in component | `{ [name: string]: string }`|         |

**strings** default fields is:

```typescript
 strings: {
   searchPlaceholder: 'Search for an asset',
   emptyLiveSearch: 'Nothing found',
 }
```
