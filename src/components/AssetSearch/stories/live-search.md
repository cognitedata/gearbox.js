## Live Search enabled

<!-- STORY -->

#### Usage:

```typescript jsx
import { AssetSearch, ApiQuery, ID } from '@cognite/gearbox';

function ExampleComponent(props) {
  const loading = false;
  const onSearch = (apiQuery: ApiQuery): void => {
    
  };
  const onLiveSearchSelect = (item: any): void => {};
  
  // this object will be set
  const liveSearchResults = [
    {
        id: 8129784932439587,
        path: [8129784932439587],
        name: 'SKA',
        description: 'Skarv',
        metadata: {}
    },
    {
        id: 7793176078609329,
        path: [7793176078609329],
        name: 'IAA',
        description: 'IAA Root node',
        metadata: { ... },
    }, {
      id: 3623339785663936,
      path: [3623339785663936],
      name: 'VAL',
      description: 'valDescription',
      metadata: { ... },
    }
  ];

  return (
    <AssetSearch
      debounceTime={500}
      onSearch={onSearch}
      liveSearch={true}
      liveSearchResults={liveSearchResults}
      onLiveSearchSelect={onLiveSearchSelect}
      loading={loading}
      strings={{ searchPlaceholder: 'Live search' }}
    />
  );

}
```
