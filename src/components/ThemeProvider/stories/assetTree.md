## With Asset Tree

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree, ThemeProvider } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <ThemeProvider
      theme={{
          textFamily: 'Courier New',
          textSize: 'large',
          listColor: 'red',
        }}
    >
      <AssetTree/>
    </ThemeProvider>
  );

}
```
