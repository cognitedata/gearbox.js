# Theme Provider

<!-- STORY -->

#### Description:

`ThemeProvider` component provides a custom theme to all `@cognite/gearbox` components. In most cases this component should be mounted in the root of your react application.

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
        primaryColor: 'orange',
        textColor: '#999',
        containerColor: '#F4F4F4',
        lightGrey: 'white',
        buttonDisabledColor: '#DDD',
        lightShadow: 'rgba(0, 0, 0, 0.15) 10px 10px 8px 8px',
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

#### Available props:
##### Required:

| Property           | Description                                  | Type                                                           | Default |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------- | ------- |
| `theme`            | A custom theme                               | `GearboxTheme`                                                 |         |
| `children`         | A child component wrapped with the theme     | `React.ReactChild`                                             |         |


### Types

#### GearboxTheme

The objects that define colours and some other CSS properties for `@cognite/gearbox` components.

Definition:

```typescript
const defaultTheme = {
  // ant design colors
  primaryColor: '#1890ff',
  infoColor: '#1890ff',
  successColor: '#1890ff',
  processingColor: '#1890ff',
  errorColor: '#f5222d',
  highlightColor: '#f5222d',
  warningColor: '#faad14',
  normalColor: '#d9d9d9',
  white: '#fff',
  black: '#000',
  textColor: 'rgba(0,0,0, 0.65)',
  textColorSecondary: 'rgba(0,0,0, 0.45)',
  textColorInverse: '#fff',
  // gearbox colors and styles
  lightGrey: '#f5f5f5',
  lightShadow:
    'rgba(0, 0, 0, 0.05) 1px 6px 20px 8px, rgba(0, 0, 0, 0.11) 0px 6px 6px',
  containerColor: '#fff',
  textColorDisabled: 'rgba(0,0,0, 0.25)',
  buttonBorderColor: '#d9d9d9',
  buttonDisabledColor: '#f5f5f5',
};

interface GearboxThemeOptional {
  textFamily?: string;
  textSize?: string;
  listColor?: string;
}

type GearboxThemeKey = keyof typeof defaultTheme;

type GearboxTheme = { [key in GearboxThemeKey]?: string } & GearboxThemeOptional;

```
