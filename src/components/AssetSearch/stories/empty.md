## Empty results 

<!-- STORY -->

**Test case:** try type *empty* in search field.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk/dist/src/types/types';

function ExampleComponent(props) {
  const onLiveSearchSelect = (item: Asset): void => {};
  const strings = { searchPlaceholder: 'Asset name', emptyLiveSearch: 'No results' }

  return (
    <AssetSearch
      onLiveSearchSelect={onLiveSearchSelect}
      strings={strings}
    />
  );

}
```
