export const ASSET_DATA = {
  id: 4650652196144007,
  path: [6687602007296940, 4650652196144007],
  depth: 1,
  name: 'VAL',
  parentId: 6687602007296940,
  description: 'Valhall plattform',
  metadata: {
    SOURCE_DB: 'workmate',
    SOURCE_TABLE: 'wmate_dba.wmt_location',
    WMT_LOCATION_ID: '1004',
    WMT_LOCATION_WORKSTART: '1999-09-01 07:00:00',
    latestUpdateTimeSource: '1552471210000',
  },
  createdTime: 0,
  lastUpdatedTime: 1553076017185,
};

export const ASSET_META_DATA_SOURCE = Object.keys(ASSET_DATA.metadata).map(
  dp => ({
    key: dp,
    name: dp,
    value: (ASSET_DATA.metadata as any)[dp],
  })
);
