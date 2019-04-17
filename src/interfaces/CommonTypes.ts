import { Asset } from '@cognite/sdk';
import { SyntheticEvent } from 'react';
import { ApiQuery, AdvancedAssetSearch } from './index';

type ID = number | string;
type OnClick = (event: SyntheticEvent) => void;
type OnAssetSearchResult = (result: any, apiQuery?: ApiQuery) => void;
type OnAssetSearch = (apiQuery: ApiQuery) => void;
type OnAssetListCallback = (assets: Asset[]) => void;
type OnAdvancedSearchChange = (searchFields: AdvancedAssetSearch) => void;

type EmptyCallback = () => void;
type StringsCallback = (strings: string[]) => void;
type AnyTypeCallback = (item: any) => void;
type IdCallback = (id: number) => void;
type SetVideoRefCallback = (element: HTMLVideoElement | null) => void;

interface OcrRequest {
  image: string;
  url?: string;
  key?: string;
}

export interface MetadataId {
  id: number;
  key: string;
  value: ID;
}

interface ErrorResponse {
  status: number;
  message: string;
  error?: Error;
}

interface PureObject {
  [name: string]: ID;
}

export {
  ID,
  OnClick,
  OnAssetSearchResult,
  OnAssetSearch,
  IdCallback,
  OnAdvancedSearchChange,
  AnyTypeCallback,
  EmptyCallback,
  StringsCallback,
  OnAssetListCallback,
  SetVideoRefCallback,
  ErrorResponse,
  OcrRequest,
  PureObject,
};
