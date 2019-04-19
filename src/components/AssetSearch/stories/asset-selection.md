## Asset Select appearance

<!-- STORY -->

#### Usage:

```typescript jsx
import { AssetSearch, ApiQuery, ID } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onSearch = (apiQuery: ApiQuery): void => {};
  const onAssetSelected = (assetId: ID): void => {}; 
  
  const assetsList = [
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
          onSearch={onSearch}
          onAssetSelected={onAssetSelected}
          rootAssetSelect={true}
          assets={assetsList}
        />
  );

}
```
