## With Theme

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';
import { ThemeProvider } from 'styled-components';

const themeExample = {
  gearbox: {
    primaryColor: 'orange',
    textColor: '#999',
    containerColor: '#F4F4F4',
    lightGrey: 'white',
    buttonDisabledColor: '#DDD',
    lightShadow: 'rgba(0, 0, 0, 0.15) 10px 10px 8px 8px',
  },
};

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};

function ExampleComponent(props) {
  return (
    <ThemeProvider theme={themeExample}>
      <TenantSelector
        title="Styled App"
        onTenantSelected={action('onTenantSelected')}
      />
    </ThemeProvider>
  );

}
```
