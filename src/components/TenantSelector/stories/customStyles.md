## Custom Styles

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};

function ExampleComponent(props) {
  return (
    <TenantSelector
      title="Styled App"
        onTenantSelected={onTenantSelected}
        advancedOptions={{ apiUrl: '', comment: 'Comment' }}
        styles={{
          title: {
            color: 'red',
            alignSelf: 'center',
            fontFamily: 'Comic Sans MS',
          },
          subTitle: {
            color: 'purple',
            alignSelf: 'center',
          },
          wrapper: {
            width: 400,
            backgroundColor: '#ffffa7',
            borderRadius: 30,
            boxShadow: 'none',
          },
          button: {
            width: 200,
            textTransform: 'none',
            alignSelf: 'center',
            borderRadius: 10,
            backgroundColor: 'magenta',
            color: 'white',
          },
          input: {
            borderRadius: 10,
            border: '2px solid #33DD33',
          },
          collapseWrapper: {
            backgroundColor: '#ffffa7',
          },
        }}
    />
  );

}
```
