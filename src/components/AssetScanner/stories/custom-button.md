## Custom ocrRequest function

<!-- STORY -->  

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { AssetScanner, Callback } from '@cognite/gearbox';
import styled from 'styled-components';

const renderButton = (capture: Callback, image?: string): React.ReactNode => {
  const Button = styled('button')`
    border-radius: 10px;
    height: 50px;
    background-color: red;
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
  `;
  return <Button onClick={capture}>{image ? 'Reset' : 'Capture'}</Button>;
};

function ExampleComponent(props) {
  const onError = (error: any): void => {};
  const onImageRecognizeFinish = (strings: string[]): void => {};
  const ocrRequest = async (image: string): Promise<string[]> => { ... };
  

  return (
    <AssetScanner
      ocrRequest={ocrRequest}
      onImageRecognizeFinish={onImageRecognizeFinish}
      button={renderButton}
    />
    
  );
}
```
