## With Custom Text

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { Event } from '@cognite/sdk';
import { EventPreview } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onShowDetails = (event: Event) = {};

  return (
    <EventPreview 
      eventId={4650652196144007}
      onShowDetails={onShowDetails}
      strings={{
          start: 'From',
          end: 'To',
          details: 'More Details',
          metadataSummary: 'Contains {{count}} more',
        }}
    />
  );

}
```
