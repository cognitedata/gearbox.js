## Custom validation success 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};
const validateTenant = (tenant: string) => Promise.resolve(true);
function ExampleComponent(props) {
  return (
    <TenantSelector
      title="Example app"
      onTenantSelected={onTenantSelected}
      validateTenant={validateTenant}
    />
  );

}
```
