# SVG viewer

<!-- STORY -->

#### Description:

SVG-viewer is a component which visualise `.svg`-documents in a user interactive way.

SVG-viewer provides the following functionality:
- Display documents with zoom and panning functionality for both desktop and mobile
- Highlight equipment and provide callbacks for further interaction
- Locate and zoom onto equipment in the document
- Search by equipment with locating and zooming results

**NOTE:** The component should have `ClientSDKProvider` as a parent component in react component tree.

#### Usage:

Using `documentId`

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        documentId={5185355395511590}
      />
    </div>
  );

}
```

Using `file`

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {

  const file = `...`

  return (
    <div style={{ height: '100vh' }}>
      <SVGViewer
        file={file}
      />
    </div>
  );

}
```

#### Available props:
##### Required:

| Property              | Description                                 | Type                        | Default |
| --------------------- | ------------------------------------------- | --------------------------- | ------- |
| `documentId`            | `fileId` or `file` must be present as Props to `SvgViewer`. `fileId` is provided by `@cognite/sdk` to fetch svg-document            | `number` |         |
| `file`                  | `file` or `fileId` must be present as Props to `SvgViewer`. `file` is the contents of the svg   | `string` |         |

#### Optional:

| Property              | Description                                 | Type                        | Default |
| --------------------- | ------------------------------------------- | --------------------------- | ------- |
| `metadataClassesConditions`            | List of classes and conditions on when they should be applied for equipment            | `Conditions[]` |         |
| `title` | Document title  | `string`                  |   |
| `description` | Document description  | `string`                  |   |
| `showOverlappedText` | Display text with stroke-width: 0  | `boolean`                  | true |
| `customClassNames` | Override default colors with custom classNames  | `CustomClassNames`                  | true |
| `isCurrentAsset` | Condition to locate and highlight current asset during first render  | `(metadataNode: Element) => boolean`                  |   |
| `handleCancel` | Viewer close callback  | `() => void;`                  |   |
| `handleAnimateZoom` | Zoom callback  | `({ zoomProgress, source, zoomCenter }: { zoomProgress: number; source: string; zoomCenter?: ZoomCenter; }) => void`                  |   |
| `handleItemClick` | Item click callback  | `(metadataNode: HTMLElement) => void;`                  |   |
| `handleDocumentLoadError` | Error document load callback  | `(error: Error) => void`                  |   |


### Types

#### Conditions

This type describes the parameters the `metadataClassesConditions` function is called with.
The type can be imported from @cognite/gearbox:

```typescript
import { Conditions } from '@cognite/gearbox';
```

Definition:

```typescript
interface Conditions {
  condition: (metadataNode: Element) => boolean;
  className: string;
}

```

#### ZoomCenter

This type describes the parameters the `handleAnimateZoom` function is called with.
The type can be imported from @cognite/gearbox:

```typescript
import { ZoomCenter } from '@cognite/gearbox';
```

Definition:

```typescript
interface ZoomCenter {
  x: number;
  y: number;
}

```

#### CustomClassNames

This type describes the parameters the `handleAnimateZoom` function is called with.
The type can be imported from @cognite/gearbox:

```typescript
import { CustomClassNames } from '@cognite/gearbox';
```

Definition:

```typescript
interface CustomClassNames {
  searchResults: string;
  currentSearchResult: string;
  currentAsset: string;
}

```
