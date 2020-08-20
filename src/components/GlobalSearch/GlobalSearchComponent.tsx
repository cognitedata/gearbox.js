// Copyright 2020 Cognite AS
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { ClientSDKContext } from '../../context/clientSDKContext';
import { globalSearch } from './globalSearch';
import { Search } from '../common/Search/Search';
import { ApiQuery } from '../..';
import groupBy from 'lodash/groupBy';
import styled from 'styled-components';
import { Icon } from 'antd';
import { withDefaultTheme } from '../../hoc';
import {
  GlobalSearchProps,
  GlobalSearchStrings,
  ItemCallback,
  RenderSearchResultParams,
  SearchForFilter,
  SearchItem,
  SearchItemResourceType,
} from './interfaces';
import { SearchResultList } from './SearchResultList';
import { CogniteClient } from '@cognite/sdk';

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

const defaultStrings: GlobalSearchStrings = {
  assets: 'Assets',
  timeSeries: 'Time Series',
  events: 'Events',
  files: 'Files',
  noDescription: '[No Description]',
  emptySearch: 'Nothing found',
  searchPlaceholder: 'Search for a resource',
};

function titleFromResource(strings: GlobalSearchStrings, item: SearchItem) {
  switch (item.resourceType) {
    case SearchItemResourceType.Asset:
    case SearchItemResourceType.Timeseries:
    case SearchItemResourceType.File:
      return item.resource.name;
    case SearchItemResourceType.Event:
      return item.resource.description || strings.noDescription;
    default:
      return 'N/A';
  }
}

function iconFromResource(item: SearchItem) {
  switch (item.resourceType) {
    case SearchItemResourceType.Asset:
      return <Icon type="deployment-unit" />;
    case SearchItemResourceType.Timeseries:
      return <Icon type="line-chart" />;
    case SearchItemResourceType.Event:
      return <Icon type="alert" />;
    case SearchItemResourceType.File:
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

  const renderList = (title: string, items: SearchItem[]) => {
    const inner =
      isLoading && !items.length ? (
        <i>Searching...</i>
      ) : (
        <SearchResultList
          strings={strings}
          onItemSelected={onItemSelected}
          onItemHover={onItemHover}
          items={items}
          renderSearchItem={renderSearchItem}
        />
      );
    return (
      <div key={title}>
        <ResourceSectionHeader>{title.toUpperCase()}</ResourceSectionHeader>
        {inner}
      </div>
    );
  };

  return (
    <>
      {Object.keys(searchForFilter)
        .filter(key => itemsGroupedByResourceType[key as keyof SearchForFilter])
        .map(key =>
          renderList(
            strings[key as keyof GlobalSearchStrings],
            itemsGroupedByResourceType[key]
          )
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
  const [searchResults, setSearchResultsState] = useState<SearchItem[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchCounter] = useState<RefCounter>(new RefCounter());
  const [searchQuery, setSearchQuery] = useState<ApiQuery>();
  const searchForFilter = useMemo(
    () =>
      !userSearchForFilter
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
    if (onSearchResults && searchResults) {
      onSearchResults(searchResults);
    }
  }, [searchResults]);

  const handleSearch = (searchQuery: ApiQuery) => {
    setSearchQuery(searchQuery);
  };
  const setSearchResults = (items: SearchItem[]) => {
    setSearchResultsState(items);
    setLoading(false);
  };

  const search = async (
    searchId: number,
    client: CogniteClient,
    query: string,
    filters: SearchForFilter,
    limitPerItem: number = 50
  ) => {
    try {
      const result = await globalSearch(client, query, filters, limitPerItem);

      if (searchId === searchCounter.currentId()) {
        setSearchResults(result);
      }
    } catch (e) {
      if (searchId === searchCounter.currentId()) {
        if (onError) {
          onError(e);
        }
        setSearchResults([]);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    if (client === null) {
      throw new Error(
        'Remember to add a ClientSDKProvider before using any Gearbox components.'
      );
    }

    if (!searchQuery.query) {
      setSearchResults([]);

      return;
    }

    setLoading(true);
    // The searchCounter prevents old search results from replacing newer search results
    const thisId = searchCounter.nextId();

    search(thisId, client, searchQuery.query, searchForFilter);
  }, [client, searchCounter, searchQuery, searchForFilter]);

  return (
    <>
      <Search loading={loading} strings={strings} onSearch={handleSearch} />
      {searchResults &&
        !!searchResults.length &&
        renderSearchResult({
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
