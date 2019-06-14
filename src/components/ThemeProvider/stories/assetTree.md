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
          fontFamily: 'Courier New',
          fontSize: 'large',
          textColor: '#a88400',
          highlightColor: '#00b893',
        }}
    >
      <AssetTree/>
    </ThemeProvider>
  );

}
```
