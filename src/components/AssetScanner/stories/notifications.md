## Custom notification

<!-- STORY -->  

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import { message } from 'antd';
import React from 'react';
import { ASNotifyTypes, AssetScanner } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onOcrError = (error: any): void => {};
  const customNotification = (
     type: ASNotifyTypes
  ) => {
     const notifications: { [name in ASNotifyTypes]: any } = {
       [ASNotifyTypes.recognizeSuccess]: () => message.info('recognizeSuccess'),
       [ASNotifyTypes.recognizeFails]: () => message.info('recognizeFails'),
       [ASNotifyTypes.assetsFind]: () => message.info('assetsFind'),
       [ASNotifyTypes.assetsEmpty]: () => message.info('assetsEmpty'),
       [ASNotifyTypes.errorVideoAccess]: () => message.info('errorVideoAccess'),
       [ASNotifyTypes.errorOccurred]: () => message.info('errorOccurred'),
     };
     return notifications[type]();
  };

  return (
    <AssetScanner
      onOcrError={onOcrError}
      ocrKey={'YOUR_GOOGLE_VISION_KEY'}
      customNotification={customNotification}
    />
    
  );

}
```
