# Asset Search

<!-- STORY -->

#### Description:

Using for assets search via name property.

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

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

##### Optionals:

| Property                | Description                                                        | Type                             | Default |
| ---------------------   | ------------------------------------------------------------------ | -------------------------------- | ------- |
| `showLiveSearchResults` | flag to show live search results in dropdown list                     | `boolean`                        | `true`  |
| `onLiveSearchSelect`    | Triggers after selecting one of items from live search results list. Required when showLiveSearchResults == true | `(asset: sdk.Asset) => void;`    |         |
| `onError`               | Triggers when search error occurs                                  | `(error: any) => void`           |         |
| `strings`               | Object of strings to be placed in component                        | `{ [name: string]: string }`     |         |
| `rootAssetSelect`       | Enable root asset selection                                        | `boolean`                        | `false` |
| `advancedSearch`        | Enable root advanced search                                        | `boolean`                        | `false` |
| `styles`                | Custom styles                                                      | `AssetSearchStyles`              |         |
| `onSearchResult`        | Triggers when search request finishes                              | `(assets: sdk.Asset[]) => void;` |         |

**strings** default fields is:

```typescript
 strings: {
   searchPlaceholder: 'Search for an asset',
   emptyLiveSearch: 'Nothing found',
 }
```

### Types:

#### AssetSearchStyles
This interface defines inline CSS styles for inner elements of `AssetSearch` component.

The type can be imported from `@cognite/gearbox`:

```typescript
import { AssetSearchStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface AssetSearchStyles {
  advancedSearchButton?: React.CSSProperties;
  searchResultList?: {
    container?: React.CSSProperties;
    listItem?: React.CSSProperties;
  };
  advancedSearch?: {
    modalBody?: React.CSSProperties;
    searchButton?: React.CSSProperties;
    clearButton?: React.CSSProperties;
    searchForm?: {
      container?: React.CSSProperties;
      addMoreMetadataButton?: React.CSSProperties;
    }
  };
}
```

See more details in `Custom Styles` example.
