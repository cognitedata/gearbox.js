## With Event Preview

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
          fontFamily: 'Trebuchet MS',
          textColorSecondary: '#555577',
          textColorAccent: 'red',
          containerColor: '#DDD',
          containerBorderColor: '#777',
        }}
      >
        <EventPreview eventId={123} />
      </ThemeProvider>
  );

}
```
