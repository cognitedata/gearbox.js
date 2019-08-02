## With Theme

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetTree } from '@cognite/gearbox';
import { ThemeProvider } from 'styled-components';

const ExampleTheme = {
  gearbox: {
    fontFamily: 'Courier New',
    fontSize: 'large',
    textColor: '#a88400',
    highlightColor: '#00b893',
  },
};

function ExampleComponent(props) {

  return (
    <ThemeProvider theme={ExampleTheme}>
      <AssetTree />
    </ThemeProvider>
  );

}
```
