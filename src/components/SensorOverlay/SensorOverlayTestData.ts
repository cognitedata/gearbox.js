import {
  EventConstantsMap,
  LabelPositionMap,
  SensorLabelConstantsMap,
} from 'components/SensorOverlay/SensorOverlay';

export const timeseriesNames = ['Timeseries1', 'Timeseries2', 'Timeseries3'];

export const sensorTagPositions: LabelPositionMap = {
  Timeseries1: {
    left: 200,
    top: 100,
    pointer: {
      left: 270,
      top: 170,
    },
    distToCamera: 0,
  },
  Timeseries2: {
    left: 700,
    top: 50,
    pointer: {
      left: 900,
      top: 100,
    },
    distToCamera: 0,
  },
  Timeseries3: {
    left: 400,
    top: 300,
    pointer: {
      left: 500,
      top: 200,
    },
    distToCamera: 0,
  },
};

export const sensorConstants: SensorLabelConstantsMap = {
  Timeseries1: {
    timeseries: {
      name: 'Timeseries1',
      description: 'The first timeseries',
      unit: 'm/s',
    },
    nodeId: 0,
    color: '#FF0000',
    threeDPos: {},
  },
  Timeseries2: {
    timeseries: {
      name: 'Timeseries2',
      description: 'The second timeseries',
      unit: '\u2103',
    },
    nodeId: 1,
    color: '#00CC00',
    threeDPos: {},
  },
  Timeseries3: {
    timeseries: {
      name: 'Timeseries3',
      description: 'The third timeseries',
      unit: 'ms',
    },
    nodeId: 2,
    color: '#0000FF',
    threeDPos: {},
  },
};

export const eventNames = ['Event1', 'Event2', 'Event3'];

export const eventPositions: LabelPositionMap = {
  Event1: {
    left: 200,
    top: 30,
    pointer: {
      left: 270,
      top: 170,
    },
    distToCamera: 0,
  },
  Event2: {
    left: 800,
    top: 250,
    pointer: {
      left: 900,
      top: 100,
    },
    distToCamera: 0,
  },
  Event3: {
    left: 400,
    top: 200,
    pointer: {
      left: 500,
      top: 200,
    },
    distToCamera: 0,
  },
};

export const eventConstants: EventConstantsMap = {
  Event1: {
    description: 'The first event',
    nodeId: 0,
    color: '#FF0000',
    threeDPos: {},
  },
  Event2: {
    description: 'The second event',
    nodeId: 1,
    color: '#00CC00',
    threeDPos: {},
  },
  Event3: {
    description: 'The third event',
    nodeId: 2,
    color: '#0000FF',
    threeDPos: {},
  },
};

export const sensorValues = {
  Timeseries1: 52,
  Timeseries2: 23,
  Timeseries3: 71,
};
