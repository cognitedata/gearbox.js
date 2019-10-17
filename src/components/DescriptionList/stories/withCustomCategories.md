## With custom categories 

<!-- STORY -->

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';

import React from 'react';
import { DescriptionList } from '@cognite/gearbox';

const metadata = {
  SOURCE_DB: 'workmate',
  SOURCE_TABLE: 'wmate_dba.wmt_location',
  WMT_LOCATION_ID: '1004',
  WMT_LOCATION_WORKSTART: '1999-09-01 07:00:00',
  latestUpdateTimeSource: '1552471210000',
}
const sourceCategory = 'Source data';
const otherCategory = 'Other';
const toCategory = (key: string) => key.includes('SOURCE') ? sourceCategory : undefined;

function ExampleComponent(props) {
  return (
    <DescriptionList
      valueSet={metadata}
      toCategory={toCategory}
      unknownCategoryName={otherCategory}
      expandedCategories={[otherCategory]}
      categoryPriorityList={[sourceCategory]}
    />
  );

}
```
