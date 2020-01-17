/* tslint:disable:no-duplicate-string */
import { CogniteEvent } from '@cognite/sdk';
import moment from 'moment';
import { AssetDocumentsPanelStyles } from '../components/AssetDocumentsPanel';
import { AssetEventsPanelStyles } from '../components/AssetEventsPanel';
import { AssetMetaStyles } from '../components/AssetMeta';
import { AssetTimeseriesPanelStyles } from '../components/AssetTimeseriesPanel';

const EVENT_DESCRIPTION = 'PRODUCTION WELL A-23, SLOT-09 (101109)';

const EVENT_METADATA = {
  SOURCE: 'WorkMate_Workitem',
  SOURCEID: 'WMATE_READ.VM_WORKORDERITEM',
  WORKORDER_ISACTIVE: 'NO',
  WORKORDER_ISMAINITEM: 'YES',
  WORKORDER_ISSAFETYCRITICAL: 'NO',
  WORKORDER_ITEMCOMPLETED: '',
  WORKORDER_ITEMINDIVIDCURRAREA: '',
  WORKORDER_ITEMINFO: EVENT_DESCRIPTION,
  WORKORDER_ITEMINSPECTAREACATEG: '',
  WORKORDER_ITEMINSPECTAREADOCNO: '',
  WORKORDER_ITEMINVOLVEDAREA: 'DP,CD',
  WORKORDER_ITEMNAME: 'A-23',
  WORKORDER_ITEMOPTIONALMAINTAG: '101100',
  WORKORDER_ITEMSYSTEM: '10',
  WORKORDER_ITEMTAGHIGHCRITICAL: 'SCE',
  WORKORDER_ITEMTAGLASTTESTED: '',
  WORKORDER_ITEMTESTMETHODCODE: '',
  WORKORDER_ITEMTESTMETHODNAME: '',
  WORKORDER_ITEMTOBEDONE: '',
  WORKORDER_ITEMTYPEOFOBJECT: 'TAG',
  WORKORDER_NUMBER: 'FAO-135939',
  WORKORDER_STATUS: '600',
  WORKORDER_STATUSISCOMPLETED: 'YES',
  WORKORDER_TASKNAME: '',
  WORKORDER_TASKNUMBER: '',
  WORKORDER_TISLOCATIONCODE: 'VAL',
};

const TEMPLATE = {
  id: 33965918626,
  startTime: 1524812400000,
  endTime: 1524373706000,
  description: EVENT_DESCRIPTION,
  type: 'Workitem',
  subtype: 'VAL',
  metadata: EVENT_METADATA,
  assetIds: [1546393076379171],
};

export const eventWithout = (field: string) => ({
  ...TEMPLATE,
  [field]: undefined,
});

const baseTimestamp = 1556120152466;

export const ASSET_META_SERIES_STYLES: AssetTimeseriesPanelStyles = {
  wrapper: {
    border: '2px red solid',
    width: '70%',
  },
  timeseriesContainer: {
    backgroundColor: '#efefef',
  },
};

export const ASSET_META_DOCS_STYLES: AssetDocumentsPanelStyles = {
  wrapper: {
    backgroundColor: '#ffea0c',
  },
  fileTitle: {
    textAlign: 'right',
    color: 'blue',
  },
  fileLink: {
    textAlign: 'right',
    color: 'red',
  },
  fileContainer: {
    width: '50%',
  },
};

export const ASSET_META_EVENTS_STYLES: AssetEventsPanelStyles = {
  table: {
    width: '80%',
  },
  tableRow: {
    backgroundColor: '#00FF00',
  },
  tableCell: {
    fontStyle: 'italic',
  },
};

export const ASSET_META_STYLES: AssetMetaStyles = {
  header: {
    textAlign: 'center',
    fontFamily: 'Comic Sans MS',
    fontSize: '1.2em',
    backgroundColor: '#ffa3d2',
  },
  emptyTab: {
    color: 'yellow',
  },
  details: {
    fontSize: '1.2em',
    color: 'green',
  },
  timeseries: ASSET_META_SERIES_STYLES,
  documents: ASSET_META_DOCS_STYLES,
  events: ASSET_META_EVENTS_STYLES,
};

export const fakeEvents: CogniteEvent[] = [
  {
    id: 1995162693488,
    type: 'Workorder',
    subtype: 'VAL',
    metadata: {
      source: 'akerbp-cdp1',
      sourceId: '8357488757942266',
    },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    startTime: baseTimestamp,
    assetIds: [4650652196144007],
    source: 'akerbp-cdpr',
    createdTime: new Date(1538252247102),
    lastUpdatedTime: new Date(1538252247102),
  },
  {
    id: 8825861064387,
    type: 'Workitem',
    subtype: 'VAL',
    metadata: {
      source: 'akerbp-cdp9',
      sourceId: '5712479887811020',
    },
    description:
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
      ' nisi ut aliquip ex ea commodo consequat.',
    startTime: baseTimestamp + 3 * 24 * 60 * 60 * 1000,
    endTime: baseTimestamp + 6 * 24 * 60 * 60 * 1000,
    assetIds: [4650652196144007],
    source: 'akerbp-cdp',
    createdTime: new Date(1544644816746),
    lastUpdatedTime: new Date(1544644816746),
  },
  {
    id: 25496029326330,
    type: 'Workorder',
    subtype: 'VAL',
    metadata: {
      source: 'akerbp-cdp5',
      sourceId: '2045316963854017',
    },
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    startTime: baseTimestamp + 13 * 24 * 60 * 60 * 1000,
    endTime: baseTimestamp + 20 * 24 * 60 * 60 * 1000,
    assetIds: [4650652196144007],
    source: 'akerbp-cdp',
    createdTime: new Date(1548932470085),
    lastUpdatedTime: new Date(1548932470085),
  },
  {
    id: 33766051546406,
    type: 'Workitem',
    subtype: 'VAL',
    metadata: {
      source: 'akerbp-cdp2',
      sourceId: '6122324097482222',
    },
    description: 'Excepteur sint occaecat cupidatat non proident',
    startTime: baseTimestamp - 20 * 24 * 60 * 60 * 1000,
    endTime: baseTimestamp - 10 * 24 * 60 * 60 * 1000,
    assetIds: [4650652196144007],
    source: 'akerbp-cdp',
    createdTime: new Date(1548273625540),
    lastUpdatedTime: new Date(1548273625540),
  },
  {
    id: 35593709738144,
    type: 'Workpackage',
    subtype: 'VAL',
    metadata: {
      source: 'akerbp-cdp4',
      sourceId: '3080723126388384',
    },
    description:
      'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
    startTime: baseTimestamp + 43 * 24 * 60 * 60 * 1000,
    endTime: baseTimestamp + 50 * 24 * 60 * 60 * 1000,
    assetIds: [4650652196144007],
    source: 'akerbp-cdp3',
    createdTime: new Date(1548932461186),
    lastUpdatedTime: new Date(1548932461186),
  },
  {
    id: 35593709738145,
    assetIds: [4650652196144007],
    source: 'akerbp-cdp3',
    createdTime: new Date(1548932461186),
    lastUpdatedTime: new Date(1548932461186),
  },
];

export const eventTimelineDataSrc = [
  [1, 1553423807995, 1553510207995, 'red', 0.2, 0.0],
  [2, +moment().subtract(1, 'd'), +moment().add(1, 'd'), 'blue', 1.0, 1.0],
  [3, +moment(), +moment().add(1, 'd'), 'green', 0.8, 1.0],
  [4, +moment(), +moment(), 'orange', 1, 1],
];

export const eventTimelineDataObject = {
  id: 1,
  min: 1553423807995,
  max: 1553510207995,
  color: 'red',
  fillOpacity: 0.2,
  strokeOpacity: 0.0,
};

export const eventPreviewStrings = {
  metadataSummary: 'Contains {{count}} additional pieces of data',
  noDescription: 'No description',
};

export const generateEventTimelineData = (
  id: number,
  min: number,
  max: number,
  color: string,
  fillOpacity: number,
  strokeOpacity: number
) => ({
  id,
  min,
  max,
  color,
  fillOpacity,
  strokeOpacity,
});
