## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
   <AssetMeta
      assetId={123456}
      styles={{
        header: {
          textAlign: 'center',
          fontFamily: 'Comic Sans MS',
          fontSize: '1.2em',
          background: '#ffa3d2',
        },
        emptyTab: {
          color: 'yellow',
        },
        details: {
          fontSize: '1.2em',
          color: 'green',
        },
        timeseries: {
          wrapper: {
            border: '2px red solid',
            width: '70%',
          },
          timeseriesContainer: {
            backgroundColor: '#efefef',
          },
        },
        documents: {
          wrapper: {
            backgroundColor: 'yellow',
          },
          fileTitle: {
            textAlign: 'right',
            color: 'blue',
          },
          fileLink: {
            textAlign: 'right',
            color: 'red',
          },
          fileContainer: {
            width: '50%',
          },
        },
        events: {
          table: {
            width: '80%',
          },
          tableRow: {
            background: '#00FF00',
          },
          tableCell: {
            fontStyle: 'italic',
          },
        },
      }}
    />
  );

}
```
