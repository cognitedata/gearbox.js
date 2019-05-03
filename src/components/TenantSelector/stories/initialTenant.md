## Initial tenant 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};

function ExampleComponent(props) {
  return (
    <TenantSelector
      title="Example app"
      initialTenant="sample-tenant"
      onTenantSelected={onTenantSelected}
    />
  );

}
```
