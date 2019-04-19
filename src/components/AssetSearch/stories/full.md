# Asset Search

<!-- STORY -->

#### Description:

Might be used for different searches.

#### Usage:

```typescript jsx
import { AssetSearch, ApiQuery } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onSearch = (apiQuery: ApiQuery): void => {};

  return (
    <AssetSearch onSearch={onSearch} />
  );

}
```

#### Available props:

| Property              | Description                                                                         | Type                  | Default |
| --------------------- | ----------------------------------------------------------------------------------- | --------------------- | ------- |
| `fetchingLimit`       | Limit of result array length                                                        | `number`              | `25`    |
| `debounceTime`        | Debounce time between end of input to search field and triggering onSearch callback | `number`              | `200`   |
| `loading`             | Flag to display loading process in search field                                     | `boolean`             | `false` |
| `rootAssetSelect`     | Trigger RootAssetSelect component appearance                                        | `boolean`             | `false` |
| `assets`              | Array of assets displaying in RootAssetSelect component                             | `Asset[]`             | `[]`    |
| `advancedSearch`      | Trigger advance search filter button appearance                                     | `boolean`             | `false` |
| `liveSearch`          | Trigger live search feature                                                         | `boolean`             | `false` |
| `liveSearchResults`   | Array of live search results to display                                             | `ListElementObject[]` | `[]`    |
| `strings`             |                                                                                     | `PureObject`          |
| `assetId`?            | Selected asset in RootAssetSelect component                                         | `number`              |
| `onSearchResults`?    |                                                                                     | `function`            |
| `onSearch`?           |                                                                                     | `function`            |
| `onAssetSelected`?    |                                                                                     | `function`            |
| `onFilterIconClick`?  |                                                                                     | `function`            |
| `onLiveSearchSelect`? |                                                                                     | `function`            |

**strings** default fields is:

```typescript
 strings: {
   changeSearch: 'Change search',
   clear: 'Clear',
   searchPlaceholder: 'Search for an asset',
   search: 'Search',
 }
```
