## Advanced search

<!-- STORY -->

#### Usage:

```typescript jsx
import { AssetSearch, ApiQuery } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onSearch = (apiQuery: ApiQuery): void => {};
  const onFilterIconClick = (): void => {}; 

  return (
    <AssetSearch
          onSearch={onSearch}
          onFilterIconClick={onFilterIconClick}
          advancedSearch={true}
        />
  );

}
```
