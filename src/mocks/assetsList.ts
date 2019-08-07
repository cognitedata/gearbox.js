import { Asset } from '@cognite/sdk/dist/src/types/types';
import { AdvancedSearch } from '../interfaces';

export const vmateDba = 'wmate_dba.wmt_location';
export const randomTime = '1999-09-01 07:00:00';
export const randomTimeDateObj1 = new Date('2002-02-02 02:02:02');
export const randomTimeDateObj2 = new Date('2002-02-22 22:22:22');
export const valDescription = 'Valhall plattform';
export const gasCompressionString = 'GAS COMPRESSION AND RE-INJECTION (PH)';
export const wmtag = 'wmate_dba.wmt_tag';

export const SKA: Asset = {
  id: 8129784932439587,
  rootId: 8129784932439587,
  lastUpdatedTime: randomTimeDateObj2,
  createdTime: randomTimeDateObj1,
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

export const IAA: Asset = {
  id: 7793176078609329,
  rootId: 7793176078609329,
  lastUpdatedTime: randomTimeDateObj2,
  createdTime: randomTimeDateObj1,
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

export const VAL: Asset = {
  id: 3623339785663936,
  rootId: 3623339785663936,
  lastUpdatedTime: randomTimeDateObj2,
  createdTime: randomTimeDateObj1,
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

export const SearchValue: AdvancedSearch = {
  name: '20-PA-001A',
  description: 'Crude pump',
  metadata: [
    { id: 1, key: 'manifacturer', value: 'FRAMO' },
    { id: 2, key: 'manifacturer2', value: 'TESLA' },
  ],
};

export const assetsList = [SKA, IAA, VAL];
