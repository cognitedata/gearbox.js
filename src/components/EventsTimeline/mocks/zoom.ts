export const zoomMock = (zoomEvents: any = {}): any => {
  const self: any = {};

  self.scaleExtent = () => self;
  self.on = jest.fn().mockImplementation((name: string, fn: any) => {
    zoomEvents[name] = fn;

    return self;
  });
  self.apply = jest.fn();

  return self;
};
