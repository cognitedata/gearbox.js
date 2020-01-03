# Value to display

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TimeseriesPreview } from '@cognite/gearbox';

function ExampleComponent(props) {
  const valueToDisplay = {
    value: 32.07,
    timestamp: new Date(),
  
  };
  const formatValue = value => {
    return `${Math.floor(Number(value))} psi`;
  };
  const nameFormatter = (name?: string) => `Name: ${name}`;
  const descriptionFormatter = (descr?: string) => `Descr: ${descr}`;

  return (
    <TimeseriesPreview
      timeseriesId={41852231325889}
      valueToDisplay={valueToDisplay}
      formatDisplayValue={formatValue}
      nameFormatter={nameFormatter}
      descriptionFormatter={descriptionFormatter}
    />
  );

}
```
