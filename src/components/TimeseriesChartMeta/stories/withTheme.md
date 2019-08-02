## With Theme

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesChartMeta } from '@cognite/gearbox';
import { ThemeProvider } from 'styled-components';

function ExampleComponent(props) {
  const exampleTheme = {
    gearbox: {
      textColor: 'Red',
      textColorSecondary: 'Coral',
    },
  };
  return (
    <ThemeProvider theme={exampleTheme}>
      <TimeseriesChartMeta
        timeseriesId={123}
      />
    </ThemeProvider>
  );

}
```
