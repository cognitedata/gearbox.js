# Asset Scanner

<!-- STORY -->

#### Description:

Using for recognising assets name strings from photo.

#### Usage requirements:

Component depends on few third-part APIs, which is provided by Google
Vision (to recognize text on picture). The user has to insert props
to the component with a valid API key for Google Vision. Follow this
guide to generate an api-key:

**Google Vision API**

> Before you can use the Cloud Vision API, you must enable it for your project and generate your API key, see here how – [Enable the Vision API](https://cloud.google.com/vision/docs/before-you-begin).   

> Don't forget for setting up API key restrictions – [Using API Keys](https://cloud.google.com/docs/authentication/api-keys).  

Google Vision API key could be pass to component via **ocrKey** prop or you can passURL address via **ocrUrl** prop in case of own backend realisation of Google Vision API call.  


#### Usage:

```typescript jsx
import React from 'react';
import { AssetScanner } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onUnauthorized = (error: any): void => {};
  return (
    <AssetScanner
      onUnauthorized={onUnauthorized}
      ocrKey={'YOUR_GOOGLE_VISION_KEY'}
    />
    
  );
  
}
```

#### Available props:

##### Required:

_No required props_

##### Optionals:

| Property             | Description                                                                | Type                             | Default                                          |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| `ocrUrl`             | URL of detect service (OCR) API                                            | `string`                         | https://vision.googleapis.com/v1/images:annotate |
| `ocrKey`             | Key property for OCR service                                               | `{ [name: string]: string }`     |                                                  |
| `customNotification` | Callback function to react on provided type of notification                   | `(type: ASNotifyTypes) => any`   |                                                  |
| `onStringRecognize`  | Callback which is triggering when strings was recognised in image          | `(strings: string[]) => void;`   |                                                  |
| `onStartLoading`     | Callback which is triggering when sdk asset search call starts             | `() => void`                     |                                                  |
| `onEndLoading`       | Callback which is triggering when sdk asset search call finished           | `() => void`                     |                                                  |
| `onAssetEmpty`       | Callback which is triggering when sdk asset search response has no results | `() => void`                     |                                                  |
| `onAssetFind`        | Callback which is triggering when sdk asset search response has results    | `(assets: sdk.Asset[]) => void;` |                                                  |
| `onUnauthorized`     | Callback which is triggering when you have no access to OCR service        | `(error: any) => void`           |                                                  |

`ASNotifyTypes` enum you can find below:

```typescript
enum ASNotifyTypes {
  recognizeSuccess = 'recognizeSuccess',
  recognizeFails = 'recognizeFails',
  assetsFind = 'assetsFind',
  assetsEmpty = 'assetsEmpty',
  errorVideoAccess = 'errorVideoAccess',
  errorOccurred = 'errorOccurred',
}
```
