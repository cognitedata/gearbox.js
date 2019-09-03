# Item click

<!-- STORY -->

#### Description:

Custom `handleSearchChange` method will provide search value as paramter.
Click search icon and start typing.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const handleSearchChange = (value?: string): void => {};

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        documentId={5185355395511590}
        handleSearchChange={handleSearchChange}
      />
    </div>
  );

}
```
