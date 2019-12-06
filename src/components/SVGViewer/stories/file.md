# File

<!-- STORY -->

#### Description:

You can use any SVG and put it into `SvgViewer` if you would like through the `file` prop. `file` simply has to include the contents of the `svg` in a string format, like the following.
#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  const file = `...`

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        file={file}
      />
    </div>
  );
  
}
```
