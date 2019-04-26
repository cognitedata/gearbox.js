import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../promise';

class MockComponentClass implements ComponentWithUnmountState {
  constructor(public isComponentUnmounted: boolean) {}
}

describe('promise helper helper', () => {
  it('should throw CanceledPromiseException on unmounted component', async () => {
    const component = new MockComponentClass(true);
    try {
      await connectPromiseToUnmountState(component, Promise.resolve());
    } catch (error) {
      expect(error instanceof CanceledPromiseException).toBeTruthy();
    }
  });

  it('should resolve on mounted component', async () => {
    const component = new MockComponentClass(false);
    const result = await connectPromiseToUnmountState(
      component,
      Promise.resolve(true)
    );
    expect(result).toBeTruthy();
  });
});
