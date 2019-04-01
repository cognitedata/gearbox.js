import moment from 'moment-timezone';

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

export const EVENTS = [
  {
    id: 33965918626,
    startTime: 1524812400000,
    endTime: 1524373706000,
    description: EVENT_DESCRIPTION,
    type: 'Workitem',
    subtype: 'VAL',
    metadata: EVENT_METADATA,
    assetIds: [1546393076379171],
  },
  {
    id: 49888151327,
    startTime: 1522306800000,
    endTime: 1523877589000,
    description: 'Utv Insp, Nom WT\u003d2,769 mm',
    type: 'Workitem',
    subtype: 'VAL',
    metadata: EVENT_METADATA,
    assetIds: [],
  },
  {
    id: 62961748915,
    startTime: 1518073200000,
    endTime: 1518781807000,
    description: 'Utv Insp, Nom WT\u003d3,05 mm',
    type: 'Workitem',
    subtype: 'VAL',
    metadata: EVENT_METADATA,
    assetIds: [],
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
