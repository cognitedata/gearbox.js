## Hidden Event Start Datetime and End Datetime

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { CogniteEvent } from '@cognite/sdk/dist/src/types/types';
import { EventPreview } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onShowDetails = (event: CogniteEvent) = {};

  return (
    <EventPreview 
      eventId={4650652196144007}
      onShowDetails={onShowDetails}
      hideProperties={['startTime', 'endTime']}
    />
  );

}
```
