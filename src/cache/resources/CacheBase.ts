// Copyright 2020 Cognite AS
export class CacheBase {
  private requests: { [name: string]: Map<string, Promise<any>> } = {};
  private responses: { [name: string]: Map<any, any> } = {};

  protected handleFirstCallToCache(key: string) {
    if (this.requests[key] || this.responses[key]) {
      return;
    }

    this.requests[key] = new Map();
    this.responses[key] = new Map();
  }

  protected checkCachedValue(
    apiCall: string,
    key: string
  ): { value: any } | null {
    const request = this.requests[apiCall].get(key);

    if (request) {
      return { value: request };
    }

    const response = this.responses[apiCall].get(key);

    if (response) {
      return { value: response };
    }

    return null;
  }

  protected cacheRequest(apiCall: string, key: string, request: Promise<any>) {
    this.requests[apiCall].set(key, request);
  }

  protected cacheResponse(apiCall: string, key: string, response: any) {
    this.responses[apiCall].set(key, response);
    this.requests[apiCall].delete(key);
  }
}
