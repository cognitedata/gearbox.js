## Custom styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import React from 'react';
import { EventPreview, EventPreviewStyles } from '@cognite/gearbox';

function ExampleComponent(props) {
  const styles: EventPreviewStyles = {
    wrapper: { backgroundColor: 'pink' },
    eventType: { color: 'green' },
    description: { color: 'yellow' },
    button: { color: 'black', backgroundColor: 'magenta' },
    times: { backgroundColor: 'purple' },
    metadata: { backgroundColor: 'lightblue' },
  };
  return (
    <EventPreview
      eventId={25496029326330}
      onShowDetails={onShowDetails}
      styles={styles}
    />
  );

}
```
