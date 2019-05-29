# Asset Scanner

<!-- STORY -->

#### Description:

Uses for recognising assets name strings from captured image.

#### Usage requirements:

By default, component uses Google Vision API (to recognize text on picture). User has to provide valid API key for Google Vision via **ocrKey** prop to use embedded OCR functional.
Please, follow this guide to generate an api-key:

**Google Vision API**

> Before you can use the Cloud Vision API, you must enable it for your project and generate your API key, see here how – [Enable the Vision API](https://cloud.google.com/vision/docs/before-you-begin).

> Don't forget for setting up API key restrictions – [Using API Keys](https://cloud.google.com/docs/authentication/api-keys).

You might provide your custom `extractOcrStrings` function to retrieve string array from OCR recognition response structure.

You also can use your own implementation of OCR call if you use your own OCR service.
Just provide `ocrRequest` function to get recognised from image strings with your own realisation of OCR request.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetScanner } from '@cognite/gearbox';

function ExampleComponent(props) {
  const onOcrError = (error: any): void => {};
  return (
    <AssetScanner onOcrError={onOcrError} ocrKey={'YOUR_GOOGLE_VISION_KEY'} />
  );
}
```

#### Available props:

##### Required:

_No required props_

##### Optionals:

| Property                 | Description                                                                                                                                      | Type                                           | Default            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------ |
| `button`                 | Render prop function, that should returns button node. Capture function and image base64 string are passed as arguments                          | `ButtonRenderProp`                             |                    |
| `customNotification`     | Callback function to react on provided type of notification                                                                                      | `(type: ASNotifyTypes) => any`                 |                    |
| `extractOcrStrings`      | Function, that get result of recognise function and format it as array of recognised strings (Can be used if you use embedded Google Vision API) | `(ocrResult: any) => string`                   |                    |
| `ocrKey`                 | Api key property which is needed if you use embedded Google Vision API                                                                           | `string`                                       |                    |
| `ocrRequest`             | Function that provide custom OCR call to detect strings on image                                                                                 | `(ocrParams: OcrRequest) => Promise<string[]>` |                    |
| `onStartLoading`         | Callback which triggers right after tacking shot from camera                                                                                     | `() => void`                                   |                    |
| `onImageRecognizeStart`  | Callback which triggers when image recognition process start                                                                                     | `(image: string) => void`                      |                    |
| `onImageRecognizeFinish` | Callback which triggers when image recognition process finish and right before fetching assets by recognised strings                             | `(strings: string[] \| null) => void`          |                    |
| `onAssetFetchResult`     | Callback which triggers when sdk asset search finished                                                                                           | `(assets: Asset[]) => void`                    |                    |
| `onEndLoading`           | Callback which triggers after finish of all recognition process                                                                                  | `() => void`                                   |                    |
| `onImageReset`           | Callback which triggers after resetting captured image                                                                                           | `() => void`                                   |                    |
| `onOcrError`             | Callback which triggers when issues appears related to OCR service/request                                                                       | `(error: any) => void`                         |                    |
| `onError`                | Callback which triggers when some error occurs                                                                                                   | `(error: any) => void`                         |                    |
| `styles`                 | Object that defines inline CSS styles for inner elements of the component (Use if you **not** provide `button` render prop)                      | `AssetScannerStyles`                           |                    |
| `strings`                | Object that defines strings to be passed to component                                                                                            | `PureObject`                                   | `{reset: 'Reset'}` |

###### ButtonRenderProp:

```typescript
type ButtonRenderProp = (
  onCapture: (...args: any[]) => void,
  image?: string
) => React.ReactNode;
```

###### ASNotifyTypes:

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

###### OcrRequest:

```typescript
interface OcrRequest {
  image: string;
  key?: string;
  extractOcrStrings?: (data: any) => string[];
}
```

###### AssetScannerStyles:

```typescript
interface AssetScannerStyles {
  button: React.CSSProperties;
}
```
