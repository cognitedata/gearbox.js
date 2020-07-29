// Copyright 2020 Cognite AS
import { CSSProperties } from 'react';

export interface SearchStyles {
  rootAssetSelect?: CSSProperties;
  advancedSearchButton?: CSSProperties;
  searchResultList?: {
    container?: CSSProperties;
    listItem?: CSSProperties;
  };
  advancedSearch?: {
    modalBody?: CSSProperties;
    searchButton?: CSSProperties;
    clearButton?: CSSProperties;
    searchForm?: {
      container?: CSSProperties;
      addMoreMetadataButton?: CSSProperties;
    };
  };
}
