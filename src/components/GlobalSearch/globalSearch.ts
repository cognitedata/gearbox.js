// Copyright 2020 Cognite AS
import {
  CogniteClient,
  EventFilter,
  AssetFilterProps,
  FileFilterProps,
  TimeseriesFilter,
} from '@cognite/sdk';
import flatten from 'lodash/flatten';
import {
  SearchForFilter,
  SearchItem,
  SearchItemResource,
  SearchItemResourceType,
} from './interfaces';

function withDiscriminator<T extends SearchItemResource>(
  l: T[],
  resourceType: SearchItemResourceType
): SearchItem[] {
  return l.map(resource => ({ resource, resourceType } as SearchItem));
}

export const globalSearch = async (
  client: CogniteClient,
  query: string,
  { assets, timeseries, events, files }: SearchForFilter,
  limitPerItem: number
): Promise<SearchItem[]> => {
  const searchForAssets = async (filter?: AssetFilterProps) => {
    if (!filter) {
      return [];
    }

    const items = await client.assets.search({
      search: {
        query,
      },
      filter,
      limit: limitPerItem,
    });

    return withDiscriminator(items, SearchItemResourceType.Asset);
  };

  const searchForTimeSeries = async (filter?: TimeseriesFilter) => {
    if (!filter) {
      return [];
    }
    const items = await client.timeseries.search({
      search: {
        query,
      },
      filter,
      limit: limitPerItem,
    });

    return withDiscriminator(items, SearchItemResourceType.Timeseries);
  };

  const searchForEvents = async (filter?: EventFilter) => {
    if (!filter) {
      return [];
    }

    const items = await client.events.search({
      search: {
        description: query,
      },
      filter,
      limit: limitPerItem,
    });

    return withDiscriminator(items, SearchItemResourceType.Event);
  };

  const searchForFiles = async (filter?: FileFilterProps) => {
    if (!filter) {
      return [];
    }
    const items = await client.files.search({
      search: {
        name: query,
      },
      filter,
      limit: limitPerItem,
    });

    return withDiscriminator(items, SearchItemResourceType.File);
  };

  const result = await Promise.all([
    searchForAssets(assets),
    searchForTimeSeries(timeseries),
    searchForEvents(events),
    searchForFiles(files),
  ]);

  return flatten(result);
};
