# Tenant Selector

<!-- STORY -->

#### Description:

Component to select a tenant.
The component requires two props, `title` and `onTenantSelected`. 

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { TenantSelector, PureObject } from '@cognite/gearbox';

const onTenantSelected = (tenant: string, advancedOptions: PureObject | null) => {};
function ExampleComponent(props) {
  return (
    <TenantSelector
      title="Example app"
      onTenantSelected={onTenantSelected}
    />
  );

}
```

#### Available props:
##### Required:

| Property           | Description                                  | Type                                                           | Default |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------- | ------- |
| `title`            | A title text                                 | `string`                                                       |         |
| `onTenantSelected` | A function called when the button is clicked | `(tenant: string, advancedOptions: PureObject \| null) => void` |         |

#### Optional:

| Property          | Description                                | Type                                                            | Default                               |
| ----------------- | ------------------------------------------ | --------------------------------------------------------------- | ------------------------------------- |
| `header`          | Text to show as header                     | `string \| React.ReactNode`                                     | `<h3>Enter your company name</h3>`    |
| `loginText`       | Text to show on the button                 | `string`                                                        | `'Login'`                             |
| `initialTenant`   | Initial value of the input field           | `string`                                                        |                                       |
| `placeholder`     | Placeholder text                           | `string`                                                        | `'cognite'`                           |
| `loginText`       | Text to show on the button                 | `string`                                                        | `'Login'`                             |
| `validateTenant`  | Asyncronous function to validate the input | `(tenant: string, advancedOptions: PureObject \| null) => Promise<boolean>` |                                       |
| `unknownMessage`  | Message to show if validation fails        | `string`                                                        | `'This is an unknown configuration.'` |
| `advancedOptions` | Object to show as advanced options         | `PureObject`                                                    |                                       |
| `onInvalidTenant` | function called when tenant is invalid     | `(tenant: string) => void`                                      |                                       |
| `styles`          | Object that defines inline CSS styles for inner elements of the component.  | `TenantSelectorStyles`         |                                       |


### Types

#### PureObject

This type describes a generic type used in gearbox.
The type can be imported from @cognite/gearbox:

```typescript
import { PureObject } from '@cognite/gearbox';
```

Definition:

```typescript
interface ID = number | string;

interface PureObject {
  [name: string]: ID;
};

```

#### TenantSelectorStyles
This interface defines inline CSS styles for inner elements of `TenantSelector` component.
You can override styles of following blocks:

<img src="tenant_selector/styling_schema.jpg" alt="Tenant Styling" width="600px">
<br><br>
The type can be imported from `@cognite/gearbox`:

```typescript
import { TenantSelectorStyles } from '@cognite/gearbox';
```

Definition:

```typescript
interface TenantSelectorStyles {
  button?: React.CSSProperties;
  collapseWrapper?: React.CSSProperties;
  input?: React.CSSProperties;
  subTitle?: React.CSSProperties;
  title?: React.CSSProperties;
  wrapper?: React.CSSProperties;
}
```

See more details in `Custom Styles` example.
