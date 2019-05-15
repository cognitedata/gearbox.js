## With Missing Properties

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { EventPreview } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <EventPreview 
      eventId={35593709738145}
      onShowDetails={onShowDetails}
    />
  );

}
```
