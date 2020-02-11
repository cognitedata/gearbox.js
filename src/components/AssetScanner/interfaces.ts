import { Asset } from '@cognite/sdk';
import { ComponentType, CSSProperties, ReactNode } from 'react';
import { Callback, CropSize, EmptyCallback } from '../../interfaces';
import { defaultStrings } from './WebcamScanner/WebcamScanner';

export type AssetScannerStrings = {
  [name in keyof typeof defaultStrings]: string;
};
export type OnAssetListCallback = (assets: Asset[]) => void;
export type SetVideoRefCallback = (element: HTMLVideoElement | null) => void;
export type ASNotification = (type: ASNotifyTypes) => any;
export type ButtonRenderProp = (
  onCapture: Callback,
  isReady: boolean
) => ReactNode;

export interface OcrRequest {
  image: string;
  key?: string;
  extractOcrStrings?: (data: any) => string[];
}

export enum ASNotifyTypes {
  recognizeSuccess = 'recognizeSuccess',
  recognizeFails = 'recognizeFails',
  assetsFind = 'assetsFind',
  assetsEmpty = 'assetsEmpty',
  errorVideoAccess = 'errorVideoAccess',
  errorOccurred = 'errorOccurred',
}

export interface AssetScannerStyles {
  button: CSSProperties;
}

export interface AssetScannerProps {
  /**
   * Function that provides custom OCR call to detect strings on image
   */
  ocrRequest: (ocrParams: OcrRequest) => Promise<string[]>;
  /**
   * Base64 image representation which uses as a source for recognition
   * (instead of webcamera image)
   */
  image?: string;
  /**
   * ocrKey	API key property which is needed if you use embedded Google Vision API
   */
  ocrKey?: string;
  /**
   * Render prop function, that should returns button node. Capture function and
   * image base64 string are passed as arguments
   */
  button?: ButtonRenderProp;
  /**
   * Function that gets a result from the recognize function and formats it as an
   * array of recognized strings (Can be used if you use embedded Google Vision API)
   */
  extractOcrStrings?: (ocrResult: any) => string[];
  /**
   * enableNotification	Flag that controls enabling/disabling notification feature.
   * If customNotification doesn't set then antd messages will be used by default
   */
  enableNotification?: boolean;
  /**
   * Callback function to react on provided type of notification (will be ignored if enableNotification = false)
   */
  customNotification?: ASNotification;
  /**
   * Callback triggered when image recognition process starts
   */
  onImageRecognizeStart?: (image: string) => void;
  /**
   * Callback triggered when image recognition process is finished and right before fetching assets by recognized strings
   */
  onImageRecognizeFinish?: (strings: string[] | null) => void;
  /**
   * Callback triggered if strings haven't been recognized on provided image
   */
  onImageRecognizeEmpty?: Callback;
  /**
   * Callback triggered when SDK asset search has been finished
   */
  onAssetFetchResult?: OnAssetListCallback;
  /**
   * Callback triggered right after taking a shot from camera
   */
  onStartLoading?: EmptyCallback;
  /**
   * Callback triggered after finishing recognition process
   */
  onEndLoading?: EmptyCallback;
  /**
   * Callback triggered when occurs an error related to OCR service/request
   */
  onOcrError?: Callback;
  /**
   * Callback triggered when an error occurs
   */
  onError?: Callback;
  /**
   * Callback triggered after resetting captured image
   */
  onImageReset?: Callback;
  /**
   * styles	Object that defines inline CSS styles for inner elements of the component
   * (Use if you not provide button render prop)
   */
  styles?: AssetScannerStyles;
  /**
   * Object that defines strings to be passed to component
   */
  imageAltText?: string;
  /**
   * Object with strings that can be passed to replace default strings
   */
  strings?: AssetScannerStrings;
  /**
   * Object to specify dimension of crop area
   */
  cropSize?: CropSize;
  /**
   * Component overlaid cropped area
   */
  webcamCropOverlay?: ComponentType;
  /**
   * Function replaces default asset fetching behaviour
   */
  getAssetsHandlerCustom?: (strings: string[]) => Promise<Asset[]>;
}
