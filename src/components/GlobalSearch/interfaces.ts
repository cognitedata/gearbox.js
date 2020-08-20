// Copyright 2020 Cognite AS
import {
  Asset,
  CogniteEvent,
  CogniteError,
  FileInfo,
  Timeseries,
  AssetFilterProps,
  EventFilter,
  FileFilterProps,
  TimeseriesFilter,
} from '@cognite/sdk';
import React from 'react';

export enum SearchItemResourceType {
  Asset = 'assets',
  Event = 'events',
  Timeseries = 'timeseries',
  File = 'files',
}

export type SearchItemResource = Asset | CogniteEvent | Timeseries | FileInfo;
export type SearchItem =
  | {
      resource: Asset;
      resourceType: SearchItemResourceType.Asset;
    }
  | {
      resource: CogniteEvent;
      resourceType: SearchItemResourceType.Event;
    }
  | {
      resource: Timeseries;
      resourceType: SearchItemResourceType.Timeseries;
    }
  | {
      resource: FileInfo;
      resourceType: SearchItemResourceType.File;
    };
export type RenderSearchItem = (
  strings: GlobalSearchStrings,
  item: SearchItem
) => React.ReactNode;
export type RenderSearchResult = (
  params: RenderSearchResultParams
) => React.ReactNode;
export type ItemCallback = (item: SearchItem) => void;

export interface SearchForFilter {
  assets?: AssetFilterProps;
  timeseries?: TimeseriesFilter;
  events?: EventFilter;
  files?: FileFilterProps;
}
export interface RenderSearchResultParams {
  strings: GlobalSearchStrings;
  isLoading: boolean;
  searchForFilter: SearchForFilter;
  onItemSelected: ItemCallback;
  onItemHover: ItemCallback;
  items: SearchItem[];
  renderSearchItem: RenderSearchItem;
}
export interface GlobalSearchProps {
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
  /**
   * Callback, which triggers on search item click event
   */
  onItemSelected?: ItemCallback;
  /**
   * Callback, which triggers on search item hover event
   */
  onItemHover?: ItemCallback;
  /**
   * Render function for the search list
   * Defines how search list should be rendered
   */
  renderSearchResult?: RenderSearchResult;
  /**
   * Render for each search element in the search list
   * Defines how search item should be rendered inside the search list
   */
  renderSearchItem?: RenderSearchItem;
  /**
   * Callback, which triggers on each search result
   */
  onSearchResults?: (results: SearchItem[]) => void;
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
