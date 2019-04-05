import { VAdvancedSearch } from 'utils/validators';

export const vmateDba = 'wmate_dba.wmt_location';
export const randomTime = '1999-09-01 07:00:00';
export const valDescription = 'Valhall plattform';
export const gasCompressionString = 'GAS COMPRESSION AND RE-INJECTION (PH)';

export const SKA = {
  id: 8129784932439587,
  path: [8129784932439587],
  name: 'SKA',
  description: 'Skarv',
  metadata: {
    SOURCE_DB: 'workmate',
    SOURCE_TABLE: vmateDba,
    WMT_LOCATION_ACTIVE: 'Y',
    WMT_LOCATION_CODE: 'SKA',
    WMT_LOCATION_EXTENDACTIVEWOP: '4',
    WMT_LOCATION_EXTERNALOWNERSHIP: 'Y',
    WMT_LOCATION_ID: '1010',
    WMT_LOCATION_MAITIS: 'Y',
    WMT_LOCATION_NAME: 'Skarv',
    WMT_LOCATION_NOCOPIESDEFAULTIC: '4',
    WMT_LOCATION_NOCOPIESWOPERMIT: '1',
    WMT_LOCATION_OPERATIONHOURS: '12',
    WMT_LOCATION_SIMULATETIMEFRAME: '60',
    WMT_LOCATION_SJAMAXNOOFTASKS: '99',
    WMT_LOCATION_USEPLOTALTITUDE: 'Y',
    WMT_LOCATION_WORKSTART: randomTime,
  },
};

export const IAA = {
  id: 7793176078609329,
  path: [7793176078609329],
  name: 'IAA',
  description: 'IAA Root node',
  metadata: {
    ASSETSCOPENAME: 'IAA',
    DESCRIPTION: 'IAA Root node',
    NAME: 'IAA',
    PARENTUID: '',
    SOURCE: 'Valid',
    SOURCEID: 'Valid.dbo.AkerBP_UNION_ALL_TAG',
    SOURCE_DB: 'valid',
    SOURCE_TABLE: 'iaaassethierarchy',
    TYPE: 'AssetHierarchy',
    UID: 'IAA',
  },
};


export const VAL = {
  id: 3623339785663936,
  path: [3623339785663936],
  name: 'VAL',
  description: valDescription,
  metadata: {
    SOURCE_DB: 'workmate',
    SOURCE_TABLE: vmateDba,
    WMT_LOCATION_ACTIVE: 'Y',
    WMT_LOCATION_CODE: 'VAL',
    WMT_LOCATION_EXTENDACTIVEWOP: '4',
    WMT_LOCATION_EXTERNALOWNERSHIP: 'Y',
    WMT_LOCATION_ID: '1004',
    WMT_LOCATION_MAITIS: 'Y',
    WMT_LOCATION_NAME: valDescription,
    WMT_LOCATION_NOCOPIESDEFAULTIC: '2',
    WMT_LOCATION_NOCOPIESWOPERMIT: '2',
    WMT_LOCATION_OPERATIONHOURS: '12',
    WMT_LOCATION_PROGVALUE: 'wmt_location_weudefaultlocation',
    WMT_LOCATION_SIMULATETIMEFRAME: '15',
    WMT_LOCATION_SJAMAXNOOFTASKS: '99',
    WMT_LOCATION_USEPLOTALTITUDE: 'Y',
    WMT_LOCATION_WORKSTART: randomTime,
  },
};

export const AssetSearchFormValue: VAdvancedSearch = {
  name: '20-PA-001A',
  description: 'Crude pump',
  metadata: [
    { id: 1, key: 'manifacturer', value: 'FRAMO' },
    { id: 2, key: 'manifacturer2', value: 'TESLA' },
  ],
};

export const assetsList = [SKA, IAA, VAL];

export const ASSET_ZERO_DEPTH_ARRAY = [
  {
    id: 6687602007296940,
    path: [6687602007296940],
    depth: 0,
    name: 'Aker BP',
    description: 'Aker BP',
    createdTime: 0,
    lastUpdatedTime: 0,
  },
  {
    id: 2675073401706610,
    path: [2675073401706610],
    depth: 0,
    name: 'VAL',
    description: valDescription,
    metadata: {
      SOURCE_DB: 'workmate',
      SOURCE_TABLE: vmateDba,
      WMT_LOCATION_ACTIVE: 'Y',
      WMT_LOCATION_CODE: 'VAL',
      WMT_LOCATION_EXTENDACTIVEWOP: '4',
      WMT_LOCATION_EXTERNALOWNERSHIP: 'Y',
      WMT_LOCATION_ID: '1004',
      WMT_LOCATION_MAITIS: 'Y',
      WMT_LOCATION_NAME: valDescription,
      WMT_LOCATION_NOCOPIESDEFAULTIC: '2',
      WMT_LOCATION_NOCOPIESWOPERMIT: '2',
      WMT_LOCATION_OPERATIONHOURS: '12',
      WMT_LOCATION_PROGVALUE: 'wmt_location_weudefaultlocation',
      WMT_LOCATION_SIMULATETIMEFRAME: '15',
      WMT_LOCATION_SJAMAXNOOFTASKS: '99',
      WMT_LOCATION_USEPLOTALTITUDE: 'Y',
      WMT_LOCATION_WORKSTART: vmateDba,
    },
    createdTime: 1534854951557,
    lastUpdatedTime: 1534854951557,
  },
];

export const ASSET_LIST_CHILD = [
  {
    id: 6687602007296940,
    path: [6687602007296940],
    depth: 0,
    name: 'Aker BP',
    description: 'Aker BP',
    createdTime: 0,
    lastUpdatedTime: 0,
  },
  {
    id: 4650652196144007,
    path: [6687602007296940, 4650652196144007],
    depth: 1,
    name: 'VAL',
    parentId: 6687602007296940,
    description: valDescription,
    metadata: {
      SOURCE_DB: 'workmate',
      SOURCE_TABLE: vmateDba,
      WMT_LOCATION_ACTIVE: 'Y',
      WMT_LOCATION_CODE: 'VAL',
      WMT_LOCATION_EXTENDACTIVEWOP: '4',
      WMT_LOCATION_EXTERNALOWNERSHIP: 'Y',
      WMT_LOCATION_ID: '1004',
      WMT_LOCATION_MAITIS: 'Y',
      WMT_LOCATION_NAME: valDescription,
      WMT_LOCATION_NOCOPIESDEFAULTIC: '2',
      WMT_LOCATION_NOCOPIESWOPERMIT: '2',
      WMT_LOCATION_OPERATIONHOURS: '12',
      WMT_LOCATION_PROGVALUE: 'wmt_location_weudefaultlocation',
      WMT_LOCATION_SIMULATETIMEFRAME: '15',
      WMT_LOCATION_SJAMAXNOOFTASKS: '99',
      WMT_LOCATION_USEPLOTALTITUDE: 'Y',
      WMT_LOCATION_WORKSTART: vmateDba,
      latestUpdateTimeSource: '1553846404000',
    },
    createdTime: 0,
    lastUpdatedTime: 1554451212648,
  },
  {
    id: 3111454725058294,
    path: [6687602007296940, 4650652196144007, 3111454725058294],
    depth: 2,
    name: '23',
    parentId: 4650652196144007,
    description: gasCompressionString,
    metadata: {
      SOURCE_DB: 'workmate',
      SOURCE_TABLE: 'wmate_dba.wmt_system',
      WMT_LOCATION_ID: '1004',
      WMT_SYSTEM_ACTIVE: 'Y',
      WMT_SYSTEM_CODE: '23',
      WMT_SYSTEM_DESC: gasCompressionString,
      WMT_SYSTEM_ID: '4440',
      WMT_SYSTEM_NAME: gasCompressionString,
    },
    createdTime: 0,
    lastUpdatedTime: 0,
  },
];
