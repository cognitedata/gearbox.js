## With Tenant Selector

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TenantSelector, ThemeProvider } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};

function ExampleComponent(props) {
  return (
    <ThemeProvider
      theme={{
        primaryColor: 'purple',
        textColor: '#DDD',
        containerColor: '#666666',
        lightGrey: 'black',
        textColorDisabled: '#888',
        lightShadow: 'none',
        buttonBorderColor: '#666666',
        buttonDisabledColor: '#777777',
      }}
    >
      <TenantSelector
        title="Example app"
        onTenantSelected={onTenantSelected}
      />
    </ThemeProvider>
  );

}
```
