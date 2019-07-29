## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { ThreeDNodeTree } from '@cognite/gearbox';
import { ThemeProvider } from 'styled-components';

function ExampleComponent(props) {
  const exampleTheme = {
    gearbox: {
      textColor: 'Chocolate',
      fontFamily: 'Comic Sans MS',
      fontSize: '16px',
    },
  };

  return (
    <ThemeProvider theme={exampleTheme}>
      <ThreeDNodeTree
        modelId = {0} revisionId = {0}
      />
    </ThemeProvider>
  );

}
```
