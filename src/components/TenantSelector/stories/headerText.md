## Header text 

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
      onTenantSelected={onTenantSelected}
      header={<em>What are you waiting for?</em>}
    />
  );

}
```
