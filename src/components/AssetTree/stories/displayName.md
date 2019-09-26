## Click item in tree 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree, OnSelectAssetTreeParams } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <AssetTree
      displayName={({id}) => \`Id: ${id}\`}
    />
  );

}
```
