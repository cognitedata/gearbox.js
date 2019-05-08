export interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export class PromiseKeeper {
  static cancelable<K>(promise: Promise<K>): CancelablePromise<K> {
    let hasCanceled = false;

    const wrappedPromise: Promise<K> = new Promise((resolve, reject) => {
      promise.then(val =>
        hasCanceled ? reject({ isCanceled: true }) : resolve(val)
      );
      promise.catch(error =>
        hasCanceled ? reject({ isCanceled: true }) : reject(error)
      );
    });

    return {
      promise: wrappedPromise,
      cancel: () => (hasCanceled = true),
    };
  }

  private hasCanceled: boolean = false;

  keep<T>(promise: Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      promise.then(val =>
        this.hasCanceled ? reject({ isCanceled: true }) : resolve(val)
      );
      promise.catch(error =>
        this.hasCanceled ? reject({ isCanceled: true }) : reject(error)
      );
    });
  }

  cancel() {
    this.hasCanceled = true;
  }
}
