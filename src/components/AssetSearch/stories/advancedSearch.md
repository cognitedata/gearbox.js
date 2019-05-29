## Advanced search

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

function ExampleComponent(props) {
  const onLiveSearchSelect = (item: Asset): void => {};

  return (
    <AssetSearch
      onLiveSearchSelect={onLiveSearchSelect}
      advancedSearch={true}
    />
  );

}
```
