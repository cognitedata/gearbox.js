## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <AssetTree
      styles={{
        list: {
          fontFamily: 'Courier New',
          fontSize: 'large',
        }
      }}
    />
  );

}
```
