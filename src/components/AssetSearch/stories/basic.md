## Basic 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk-alpha/dist/src/types/types';

function ExampleComponent(props) {
  const onLiveSearchSelect = (item: Asset): void => {};
  const strings = { searchPlaceholder: 'Try to type name of asset', }

  return (
    <AssetSearch
      onLiveSearchSelect={onLiveSearchSelect}
      strings={strings}
    />
  );

}
```
