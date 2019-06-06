## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetDocumentsPanel } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetDocumentsPanel
      assetId={4650652196144007}
      styles={{
        wrapper: {border: '1px solid red' },
        fileContainer: { backgroundColor: '#DDD', padding: 8 },
        fileLink: { color: 'purple' },
        fileTitle: { color: 'magenta', fontSize: '1em' },
      }}
    />
  );
  
}
```
