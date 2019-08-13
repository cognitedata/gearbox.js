# Asset Scanner

<!-- STORY -->

#### Description:

The component can be used for recognizing the name of an asset in a captured image (from a webcam)

#### Usage requirements:

By default, component uses Google Vision API (to recognize text on the picture). User has to provide a valid API key for Google Vision via **ocrKey** prop to use embedded OCR functional.
Please, follow this guide to generate an API key:

**Google Vision API**

> Before you can use the Cloud Vision API, you must enable it for your project and generate your API key, see here how – [Enable the Vision API](https://cloud.google.com/vision/docs/before-you-begin).

> Don't forget to set API key restrictions – [Using API Keys](https://cloud.google.com/docs/authentication/api-keys).

You might provide your custom `extractOcrStrings` function to retrieve an array of strings from OCR recognition response structure.

You also can use your own implementation of OCR call if you use your own OCR service.
Just provide `ocrRequest` function to retrieve strings recognized from an image with your own implementation of OCR request.


**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetScanner } from '@cognite/gearbox';

function ExampleComponent(props) {
  
  const onOcrError = (error: any): void => {};
  return (
    <AssetScanner 
      onOcrError={onOcrError} 
      enableNotification={true} 
      ocrKey={'YOUR_GOOGLE_VISION_KEY'} 
    />
  
  );

}
```

#### Available props:

##### Required:

_No required props_

##### Optionals:

| Property                 | Description                                                                                                                                                  | Type                                           | Default            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------ |
| `button`                 | Render prop function, that should returns button node. Capture function and image base64 string are passed as arguments                                      | `ButtonRenderProp`                             |                    |
| `image`                  | Base64 image representation which uses as a source for recognition (instead of webcamera image)                                                              | `string`                                       |                    |
| `enableNotification`     | Flag that controls enabling/disabling notification feature. If `customNotification` doesn't set then antd messages will be used by default                   | `boolean`                                      | `false`            |
| `customNotification`     | Callback function to react on provided type of notification (will be ignored if `enableNotification = false`)                                                | `(type: ASNotifyTypes) => any`                 |                    |
| `extractOcrStrings`      | Function that gets a result from the recognize function and formats it as an array of recognized strings (Can be used if you use embedded Google Vision API) | `(ocrResult: any) => string`                   |                    |
| `ocrKey`                 | API key property which is needed if you use embedded Google Vision API                                                                                       | `string`                                       |                    |
| `ocrRequest`             | Function that provides custom OCR call to detect strings on image                                                                                            | `(ocrParams: OcrRequest) => Promise<string[]>` |                    |
| `onStartLoading`         | Callback triggered right after taking a shot from camera                                                                                                     | `() => void`                                   |                    |
| `onImageRecognizeStart`  | Callback triggered when image recognition process starts                                                                                                     | `(image: string) => void`                      |                    |
| `onImageRecognizeFinish` | Callback triggered when image recognition process is finished and right before fetching assets by recognized strings                                         | `(strings: string[] \| null) => void`          |                    |
| `onImageRecognizeEmpty`  | Callback triggered if strings haven't been recognized on provided image                                                                                      | `() => void`          |                        |
| `onAssetFetchResult`     | Callback triggered when SDK asset search has been finished                                                                                                   | `(assets: Asset[]) => void`                    |                    |
| `onEndLoading`           | Callback triggered after finishing recognition process                                                                                                       | `() => void`                                   |                    |
| `onImageReset`           | Callback triggered after resetting captured image                                                                                                            | `() => void`                                   |                    |
| `onOcrError`             | Callback triggered when occurs an error related to OCR service/request                                                                                       | `(error: any) => void`                         |                    |
| `onError`                | Callback triggered when an error occurs                                                                                                                      | `(error: any) => void`                         |                    |
| `styles`                 | Object that defines inline CSS styles for inner elements of the component (Use if you **not** provide `button` render prop)                                  | `AssetScannerStyles`                           |                    |
| `strings`                | Object that defines strings to be passed to component                                                                                                        | `PureObject`                                   | `{reset: 'Reset'}` |

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
