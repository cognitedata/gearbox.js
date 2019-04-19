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
##### Required:

*No required properties*

##### Optionals:

| Property              | Description                                                                                                                      | Type                  | Default |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------- |
| `advancedSearch`      | Trigger advance search filter button appearance                                                                                  | `boolean`             | `false` |
| `assetId`             | Selected asset in RootAssetSelect component                                                                                      | `number`              |
| `assets`              | Array of assets displaying in RootAssetSelect component                                                                          | `Asset[]`             | `[]`    |
| `debounceTime`        | Debounce time between end of input to search field and triggering onSearch callback                                              | `number`              | `200`   |
| `fetchingLimit`       | Limit of result array length                                                                                                     | `number`              | `25`    |
| `liveSearch`          | Trigger live search feature                                                                                                      | `boolean`             | `false` |
| `liveSearchResults`   | Array of live search results to display                                                                                          | `ListElementObject[]` | `[]`    |
| `loading`             | Flag to display loading process in search field                                                                                  | `boolean`             | `false` |
| `onAssetSelected`     | Callback that triggers after changing of asset in RootAssetSelectComponent (available only if `rootAssetSelect = true`)          | `function`            |
| `onFilterIconClick`   | Callback that triggers after opening of advance search modal window (available only if `advancedSearch = true`)                  | `function`            |
| `onLiveSearchSelect`  | Callback that triggers after clicking on one of items represented in live search results (available only if `liveSearch = true`) | `function`            |
| `onSearch`            | Callback that triggers after end of input                                                                                        | `function`            |
| `rootAssetSelect`     | Trigger RootAssetSelect component appearance                                                                                     | `boolean`             | `false` |
| `strings`             | Object of strings to be placed in component                                                                                      | `PureObject`          |

**strings** default fields is:

```typescript
 strings: {
   changeSearch: 'Change search',
   clear: 'Clear',
   searchPlaceholder: 'Search for an asset',
   search: 'Search',
 }
```
