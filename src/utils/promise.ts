export interface ComponentWithUnmountState {
  isComponentUnmounted: boolean;
}

export function bindPromiseToUnmountState<T>(
  component: ComponentWithUnmountState,
  promise: Promise<T>
): Promise<T> {
  return promise.then((results: T) => {
    if (component.isComponentUnmounted) {
      throw new Error('Promise was rejected on unmounted component');
    } else {
      return results;
    }
  });
}
