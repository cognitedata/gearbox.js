## Error handling

<!-- STORY -->

**Test case:** try type *error* in search field.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetSearch } from '@cognite/gearbox';
import { Asset } from '@cognite/sdk';

function ExampleComponent(props) {
  const onError = (error: any): void => {}; 
  const onLiveSearchSelect = (item: Asset): void => {};
  const strings = { searchPlaceholder: 'Type "error" to check behaviour' }

  return (
    <AssetSearch
      onError={onError}
      onLiveSearchSelect={onLiveSearchSelect}
      strings={strings}
    />
  );

}
```
