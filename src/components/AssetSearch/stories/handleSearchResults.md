## Handle search results

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

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
