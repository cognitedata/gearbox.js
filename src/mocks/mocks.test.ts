import {
  eventTimelineDataObject,
  eventTimelineDataSrc,
  eventWithout,
  generateEventTimelineData,
} from './index';

describe('EventPreview mock data tests', () => {
  it('"eventWithout" function set < undefined > to expected field', () => {
    expect(eventWithout('id')).toHaveProperty('id', undefined);
  });

  it('"generateEventTimelineData" function returns right object structure', () => {
    expect(
      // @ts-ignore
      generateEventTimelineData(...eventTimelineDataSrc[0])
    ).toEqual(eventTimelineDataObject);
  });
});
