## Handle search results

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk-alpha/dist/src/types/types';

function ExampleComponent(props) {
  const onSearchResult = (assets: Asset[]): void => {};

  return (
    <AssetSearch
      showLiveSearchResults={false}
      onSearchResult={onSearchResult}
    />
  );

}
```
