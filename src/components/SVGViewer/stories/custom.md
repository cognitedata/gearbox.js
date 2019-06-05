# Specify custom default classes

<!-- STORY -->

#### Description:

`customClassNames` object is responsible for overriding default classNames

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import styled from 'styled-components';
import React from 'react';
import { SVGViewer } from '@cognite/gearbox';

function ExampleComponent(props) {
  const Container = styled.div\` 
    &.search-result {
      &.metadata-container {
        text {
          stroke: red !important;
          fill: red !important;
          font-weight: bold;
        }
      }
      &:not(.metadata-container) {
        stroke: red !important;
        fill: red !important;
        font-weight: bold;
      }
    }
  `;
  
  return (
    <div style={{ height: '100vh' }}>
      <Container style={{ height: '100vh' }}>
        <SVGViewer
          documentId={5185355395511590}
          customClassNames={{
            searchResults: 'search-result',
          }}
        />
      </Container>
    </div>
  );

}
```
