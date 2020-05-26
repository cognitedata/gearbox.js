// Copyright 2020 Cognite AS
import {
  CogniteClient,
  Asset,
  CogniteEvent,
  FileInfo,
  Timeseries,
  EventFilter,
  AssetFilterProps,
  FileFilterProps,
  TimeseriesFilter,
} from '@cognite/sdk';
import flatten from 'lodash/flatten';

export type SearchItem =
  | { resource: Asset; resourceType: 'asset' }
  | { resource: CogniteEvent; resourceType: 'event' }
  | { resource: Timeseries; resourceType: 'timeSeries' }
  | { resource: FileInfo; resourceType: 'file' };

function withDiscriminator<
  T extends Asset | CogniteEvent | Timeseries | FileInfo
>(l: T[], resourceType: string): SearchItem[] {
  return l.map(resource => ({ resource, resourceType } as SearchItem));
}

export type SearchForFilter = {
  assets?: AssetFilterProps | null;
  timeSeries?: TimeseriesFilter | null;
  events?: EventFilter | null;
  files?: FileFilterProps | null;
};

export function globalSearch(
  client: CogniteClient,
  query: string,
  { assets, timeSeries, events, files }: SearchForFilter,
  limitPerItem: number
): Promise<SearchItem[]> {
  const resolveEmptyIfNull = <T, U>(
    f: (filter: U) => Promise<T[]>,
    filter?: U | null
  ) => {
    if (filter != null) {
      return f(filter);
    } else {
      return Promise.resolve([]);
    }
  };

  const searchForAssets = (filter: AssetFilterProps) =>
    client.assets
      .search({
        search: {
          query,
        },
        filter,
        limit: limitPerItem,
      })
      .then(l => withDiscriminator(l, 'asset'));

  const searchForTimeSeries = (filter: TimeseriesFilter) =>
    client.timeseries
      .search({
        search: {
          query,
        },
        filter,
        limit: limitPerItem,
      })
      .then(l => withDiscriminator(l, 'timeSeries'));

  const searchForEvents = (filter: EventFilter) =>
    client.events
      .search({
        search: {
          description: query,
        },
        filter,
        limit: limitPerItem,
      })
      .then(l => withDiscriminator(l, 'event'));

  const searchForFiles = (filter: FileFilterProps) =>
    client.files
      .search({
        search: {
          name: query,
        },
        filter,
        limit: limitPerItem,
      })
      .then(l => withDiscriminator(l, 'file'));

  return Promise.all([
    resolveEmptyIfNull(searchForAssets, assets),
    resolveEmptyIfNull(searchForTimeSeries, timeSeries),
    resolveEmptyIfNull(searchForEvents, events),
    resolveEmptyIfNull(searchForFiles, files),
  ]).then(l => flatten(l));
}
