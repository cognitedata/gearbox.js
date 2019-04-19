## Custom placeholder

<!-- STORY -->

#### Usage:

```typescript jsx
import { AssetSearch, ApiQuery } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onSearch = (apiQuery: ApiQuery): void => {};

  return (
    <AssetSearch
      onSearch={onSearch}
      strings={{ searchPlaceholder: 'Custom text' }}
    />
  );

}
```
