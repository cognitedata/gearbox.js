## Custom styles 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch, AssetSearchStyles } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk/dist/src/types/types';

function ExampleComponent(props) {
  const onLiveSearchSelect = (item: Asset): void => {};
  const styles: AssetSearchStyles = {
        advancedSearchButton: { backgroundColor: 'red' },
        rootAssetSelect: { width: '40%' },
        searchResultList: {
          container: {
            backgroundColor: 'purple',
            marginTop: '20px',
          },
          listItem: { marginTop: '10px' },
        },
        advancedSearch: {
          modalBody: { backgroundColor: 'green' },
          searchButton: { backgroundColor: 'teal' },
          clearButton: { backgroundColor: 'magenta' },
          searchForm: {
            container: { backgroundColor: 'gray' },
            addMoreMetadataButton: { backgroundColor: 'lightblue' },
          },
        },
      };

  return (
    <AssetSearch
      onLiveSearchSelect={onLiveSearchSelect}
      styles={styles}
      advancedSearch={true}
      rootAssetSelect={true}
    />
  );

}
```
