export interface ComponentWithUnmountState {
  isComponentUnmounted: boolean;
}

export class CanceledPromiseException {}

export function connectPromiseToUnmountState<T>(
  component: ComponentWithUnmountState,
  promise: Promise<T>
): Promise<T> {
  return promise.then((results: T) => {
    if (!component || component.isComponentUnmounted) {
      throw new CanceledPromiseException();
    } else {
      return results;
    }
  });
}
