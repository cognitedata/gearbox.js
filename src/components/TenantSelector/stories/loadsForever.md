## Loads forever 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};
const validateTenant = (tenant: string) => Promise.race([]));
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
