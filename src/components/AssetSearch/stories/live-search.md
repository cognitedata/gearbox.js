## Live Search enabled

<!-- STORY -->

#### Usage:

```typescript jsx
import React, { useState } from 'react';
import { AssetSearch, ApiQuery } from '@cognite/gearbox';
import { debounce } from 'lodash';

function ExampleComponent() {
  const strings = {
    searchPlaceholder: 'Live search'
  };
  const resultsArray = [
    {
      id: 8129784932439587,
      path: [8129784932439587],
      name: 'SKA',
      description: 'Skarv',
      metadata: {}
    },
    {
      id: 7793176078609329,
      path: [7793176078609329],
      name: 'IAA',
      description: 'IAA Root node',
      metadata: { ... },
    }, {
      id: 3623339785663936,
      path: [3623339785663936],
      name: 'VAL',
      description: 'valDescription',
      metadata: { ... },
    }
  ];
  const initial: any[] = [];
  const [liveSearchResults, setResults] = useState(initial);
  const [loading, setLoading] = useState(false);
  const onLiveSearchSelect = (item: any): void => {};
  const onSearch = (query: ApiQuery): void => {
    setLoading(true);
    onSearchLive(query);
  };
  
  // modeling async request
  const onSearchLive = debounce(apiQuery => {
    setLoading(false);
    setResults(resultsArray.slice());
  }, 1000);


  return (
    <AssetSearch
      debounceTime={500}
      onSearch={onSearch}
      liveSearch={true}
      liveSearchResults={liveSearchResults}
      onLiveSearchSelect={onLiveSearchSelect}
      loading={loading}
      strings={strings}
    />
  
    );
}
```
