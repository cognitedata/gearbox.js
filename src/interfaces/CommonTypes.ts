import { Asset } from '@cognite/sdk-alpha/dist/src/types/types';
import { SyntheticEvent } from 'react';
import { AdvancedSearch } from './index';

export type ID = number | string;
export type OnClick = (event: SyntheticEvent) => void;
export type OnAssetListCallback = (assets: Asset[]) => void;
export type OnAdvancedSearchChange = (searchFields: AdvancedSearch) => void;

export type Callback = (...args: any[]) => void;
export type EmptyCallback = () => void;
export type StringsCallback = (strings: string[]) => void;
export type IdCallback = (id: number) => void;
export type SetVideoRefCallback = (element: HTMLVideoElement | null) => void;

export interface EventHandlers {
  [name: string]: Callback[];
}

export interface OcrRequest {
  image: string;
  key?: string;
  extractOcrStrings?: (data: any) => string[];
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
