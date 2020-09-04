// Copyright 2020 Cognite AS
import React, { useState } from 'react';
import { MockCogniteClient } from '../../../mocks';
import {
  ASSET_LIST_CHILD,
  timeseriesListV2,
  fakeEvents,
  fakeFiles,
} from '../../../mocks';
import { ClientSDKProvider } from '../../..';
import { AssetSearchFilter } from '@cognite/sdk';
import { GlobalSearchStrings } from '../GlobalSearchComponent';
import { SearchItem, SearchForFilter } from '../globalSearch';
import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    search: (query: AssetSearchFilter) => {
      if (query.search && query.search.query === 'empty') {
        return Promise.resolve([]);
      }

      if (query.search && query.search.query === 'error') {
        return Promise.reject(new Error('sdk search request failed'));
      }

      if (query.search && query.search.query === 'loading') {
        return new Promise(_ => {
          // Never resolves
        });
      }

      return new Promise(resolve => {
        setTimeout(() => resolve(ASSET_LIST_CHILD), 1000);
      });
    },
  };
  timeseries: any = {
    search: () => {
      return Promise.resolve([
        ...timeseriesListV2,
        ...timeseriesListV2.map(t => ({ ...t, id: t.id + 1 })),
      ]);
    },
  };
  files: any = {
    search: () => {
      return Promise.resolve(fakeFiles);
    },
  };
  events: any = {
    search: () => {
      return Promise.resolve(fakeEvents);
    },
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const heightProp = '300px';

export function titleFromResource(
  strings: GlobalSearchStrings,
  item: SearchItem
) {
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

export function renderSearchItem(
  strings: GlobalSearchStrings,
  item: SearchItem
) {
  const title = titleFromResource(strings, item);
  return <div style={{ padding: '16px 0px' }}>{title}</div>;
}

export const searchForDecorator = (storyFn: any) => {
  const [searchForFilter, setSearchForFilter] = useState<SearchForFilter>({
    assets: {},
  });
  const options = [
    { label: 'Assets', value: 'assets' },
    { label: 'Time Series', value: 'timeSeries' },
    { label: 'Events', value: 'events' },
    { label: 'Files', value: 'files' },
  ];

  const onOptionsChange = (checkedValues: CheckboxValueType[]) => {
    setSearchForFilter({
      assets: checkedValues.includes('assets') ? {} : null,
      timeSeries: checkedValues.includes('timeSeries') ? {} : null,
      events: checkedValues.includes('events') ? {} : null,
      files: checkedValues.includes('files') ? {} : null,
    });
  };

  return (
    <>
      <Checkbox.Group
        onChange={onOptionsChange}
        options={options}
        defaultValue={['assets']}
      />
      <br />
      <br />
      {storyFn({ searchForFilter })}
    </>
  );
};

export const hoverDecorator = (storyFn: any) => {
  const [itemHovered, setItemHovered] = useState<SearchItem>();
  return (
    <>
      {itemHovered ? (
        <p>{`${itemHovered.resourceType}: ${itemHovered.resource.id}`}</p>
      ) : null}
      {storyFn({ setItemHovered })}
    </>
  );
};

const rootAsset = 1;
export const searchForFilter: SearchForFilter = {
  assets: {
    rootIds: [{ id: rootAsset }],
  },
  timeSeries: {
    rootAssetIds: [rootAsset],
  },
  events: {
    rootAssetIds: [{ id: rootAsset }],
  },
  files: {
    rootAssetIds: [{ id: rootAsset }],
  },
};
