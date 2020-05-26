// Copyright 2020 Cognite AS
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { globalSearch, SearchItem, SearchForFilter } from './globalSearch';
import { Search } from '../common/Search/Search';
import { PureObject, ApiQuery } from '../..';
import groupBy from 'lodash/groupBy';
import styled from 'styled-components';
import { Icon } from 'antd';
import { withDefaultTheme } from '../../hoc';
import { SearchResultList } from './SearchResultList';
import { CogniteError } from '@cognite/sdk';

class RefCounter {
  id: number;
  constructor() {
    this.id = 0;
  }

  currentId(): number {
    return this.id;
  }

  nextId(): number {
    return ++this.id;
  }
}

export type GlobalSearchStrings = {
  assets: string;
  timeSeries: string;
  events: string;
  files: string;
  noDescription: string;
  emptySearch: string;
  searchPlaceholder: string;
};

const defaultStrings: GlobalSearchStrings = {
  assets: 'Assets',
  timeSeries: 'Time Series',
  events: 'Events',
  files: 'Files',
  noDescription: '[No Description]',
  emptySearch: 'Nothing found',
  searchPlaceholder: 'Search for a resource',
};

export type RenderSearchItem = (
  strings: GlobalSearchStrings,
  item: SearchItem
) => React.ReactNode;
export type ItemCallback = (item: SearchItem) => void;
export type RenderSearchResultParams = {
  strings: GlobalSearchStrings;
  isLoading: boolean;
  searchForFilter: SearchForFilter;
  onItemSelected: ItemCallback;
  onItemHover: ItemCallback;
  items: SearchItem[];
  renderSearchItem: RenderSearchItem;
};

type GlobalSearchProps = {
  onError?: (error: CogniteError) => void;
  /**
   * Sets search filters per resource.
   * It is also used to toggle search for a resource, by setting any of the fields to null | undefined.
   * For example this will only search for assets
   * ```
   * <GlobalSearch searchForFilter={{assets: {}}} />
   * ```
   */
  searchForFilter?: SearchForFilter;
  strings?: Partial<GlobalSearchStrings>;
  onItemSelected?: ItemCallback;
  onItemHover?: ItemCallback;
  renderSearchResult?: (params: RenderSearchResultParams) => React.ReactNode;
  renderSearchItem?: RenderSearchItem;
  onSearchResults?: (results: SearchItem[]) => void;
};

function titleFromResource(strings: GlobalSearchStrings, item: SearchItem) {
  switch (item.resourceType) {
    case 'asset':
      return item.resource.name;
    case 'timeSeries':
      return item.resource.name;
    case 'event':
      return item.resource.description || strings.noDescription;
    case 'file':
      return item.resource.name;
    default:
      return 'N/A';
  }
}

function iconFromResource(item: SearchItem) {
  switch (item.resourceType) {
    case 'asset':
      return <Icon type="deployment-unit" />;
    case 'timeSeries':
      return <Icon type="line-chart" />;
    case 'event':
      return <Icon type="alert" />;
    case 'file':
      return <Icon type="file" />;
  }
}

function defaultRenderSearchItem(
  strings: GlobalSearchStrings,
  item: SearchItem
) {
  const title = titleFromResource(strings, item);
  const icon = iconFromResource(item);
  return (
    <div style={{ padding: '4px 0px' }}>
      <span style={{ marginRight: '6px' }}>{icon}</span>
      {title}
    </div>
  );
}

function defaultRenderSearchResult({
  strings,
  isLoading,
  searchForFilter,
  onItemSelected,
  onItemHover,
  items,
  renderSearchItem,
}: RenderSearchResultParams) {
  const itemsGroupedByResourceType = groupBy(items, item => item.resourceType);

  const renderListIfNotNull = (
    renderIfNotNull: any, // Can't use generic syntax for lambda functions in tsx files
    title: string,
    items: SearchItem[]
  ) => {
    if (renderIfNotNull != null) {
      const itemsOrEmpty = items != null ? items : [];
      const inner =
        isLoading && itemsOrEmpty.length == 0 ? (
          <i>Searching...</i>
        ) : (
          <SearchResultList
            strings={strings}
            onItemSelected={onItemSelected}
            onItemHover={onItemHover}
            items={itemsOrEmpty}
            renderSearchItem={renderSearchItem}
          ></SearchResultList>
        );
      return (
        <>
          <ResourceSectionHeader>{title.toUpperCase()}</ResourceSectionHeader>
          {inner}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {renderListIfNotNull(
        searchForFilter.assets,
        strings.assets,
        itemsGroupedByResourceType.asset
      )}
      {renderListIfNotNull(
        searchForFilter.timeSeries,
        strings.timeSeries,
        itemsGroupedByResourceType.timeSeries
      )}
      {renderListIfNotNull(
        searchForFilter.events,
        strings.events,
        itemsGroupedByResourceType.event
      )}
      {renderListIfNotNull(
        searchForFilter.files,
        strings.files,
        itemsGroupedByResourceType.file
      )}
    </>
  );
}

export function GlobalSearch({
  strings: userStrings,
  searchForFilter: userSearchForFilter,
  onError,
  renderSearchResult: userRenderSearchResult,
  renderSearchItem: userRenderSearchItem,
  onItemSelected: userOnItemSelected,
  onSearchResults,
  onItemHover: userOnItemHover,
}: GlobalSearchProps) {
  const [searchResults, setSearchResultsState] = useState<SearchItem[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchCounter] = useState<RefCounter>(new RefCounter());
  const [searchQuery, setSearchQuery] = useState<ApiQuery | null>();
  const searchForFilter = useMemo(
    () =>
      userSearchForFilter == null
        ? {
            assets: {},
            events: {},
            timeSeries: {},
            files: {},
          }
        : userSearchForFilter,
    [userSearchForFilter]
  );
  const client = useContext(ClientSDKContext);

  const strings = { ...defaultStrings, ...(userStrings || {}) };

  const renderSearchResult =
    userRenderSearchResult || defaultRenderSearchResult;
  const renderSearchItem = userRenderSearchItem || defaultRenderSearchItem;
  const onItemSelected: ItemCallback = item => {
    if (userOnItemSelected) {
      userOnItemSelected(item);
    }
  };
  const onItemHover: ItemCallback = item => {
    if (userOnItemHover) {
      userOnItemHover(item);
    }
  };

  useEffect(() => {
    if (onSearchResults && searchResults != null) {
      onSearchResults(searchResults);
    }
  }, [searchResults]);

  const handleSearch = (searchQuery: ApiQuery) => {
    setSearchQuery(searchQuery);
  };
  const setSearchResults = (items: SearchItem[] | null) => {
    setSearchResultsState(items);
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery == null) {
      return;
    }

    if (client == null) {
      throw new Error(
        'Remember to add a ClientSDKProvider before using any Gearbox components.'
      );
    }

    if (searchQuery.query == null || searchQuery.query === '') {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    // The searchCounter prevents old search results from replacing newer search results
    const thisId = searchCounter.nextId();
    // We are not using await here,
    // because the useEffect function doesn't expect a Promise returned
    globalSearch(client, searchQuery.query, searchForFilter, 50)
      .then(res => {
        if (thisId === searchCounter.currentId()) {
          setSearchResults(res);
        }
      })
      .catch(err => {
        if (thisId === searchCounter.currentId()) {
          if (onError) {
            onError(err);
          }
          setSearchResults(null);
        }
      });
  }, [client, searchCounter, searchQuery, searchForFilter]);

  return (
    <>
      <Search
        loading={loading}
        strings={strings as PureObject}
        onSearch={handleSearch}
      />
      {searchResults == null
        ? null
        : renderSearchResult({
            strings,
            isLoading: loading,
            searchForFilter,
            onItemSelected,
            onItemHover,
            items: searchResults,
            renderSearchItem,
          })}
    </>
  );
}

const ResourceSectionHeader = withDefaultTheme(styled.h2`
  font-weight: 600;
  margin-top: 8px;
`);
