## With Theme

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import React from 'react';
import { EventPreview, EventPreviewStyles } from '@cognite/gearbox';
import { ThemeProvider } from 'styled-components';

function ExampleComponent(props) {
  const exampleTheme = {
    gearbox: {
      containerColor: 'AliceBlue',
      containerBorderColor: 'Aqua',
      textColorAccent: 'Coral',
      textColorSecondary: 'ForestGreen',
    },
  };
  return (
    <ThemeProvider theme={exampleTheme}>
      <EventPreview
        eventId={25496029326330}
        onShowDetails={onShowDetails}
      />
    </ThemeProvider>
  );

}
```
