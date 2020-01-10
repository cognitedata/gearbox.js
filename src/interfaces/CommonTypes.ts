export type ID = number | string;
export type OnAdvancedSearchChange = (searchFields: AdvancedSearch) => void;
export type Callback = (...args: any[]) => void;
export type EmptyCallback = () => void;
export type IdCallback = (id: number) => void;
export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;

export interface EventHandlers {
  [name: string]: Callback[];
}

export interface MetadataId {
  id: number;
  key: string;
  value: ID;
}

export interface ErrorResponse {
  status: number;
  message: string;
  error?: Error;
}

export interface PureObject {
  [name: string]: ID;
}

export interface CacheObject {
  [name: string]: any;
}

export interface MouseScreenPosition {
  offsetX: number;
  offsetY: number;
}

export interface CropSize {
  width: number;
  height: number;
}

export interface AdvancedSearch {
  name?: string;
  description?: string;
  metadata?: MetadataId[];
}

export interface ApiQuery {
  fetchingLimit: number;
  assetSubtrees: number[] | null;
  query: string;
  advancedSearch: AdvancedSearch | null;
}
