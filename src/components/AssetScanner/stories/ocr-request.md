## Custom ocrRequest function

<!-- STORY -->  

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetScanner } from '@cognite/gearbox';

import { doOcr } from 'your-ocr-implementation';
import { extractStrings } from 'your-extract-strings-implementation';

function ExampleComponent(props) {
  const onError = (error: any): void => {};
  const onImageRecognizeFinish = (strings: string[]): void => {};
  const ocrRequest = async (image: string): Promise<string[]> => {
    const recognise = await doOcr(image); 
    return extractStrings(recognise);
  
  };
  

  return (
    <AssetScanner
      onError={onError}
      ocrRequest={ocrRequest}
      onImageRecognizeFinish={onImageRecognizeFinish}
    />
    
  );
}
```
