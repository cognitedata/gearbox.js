import { message } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Callback, ErrorResponse } from '../../../interfaces';
import { assetsList, sleep } from '../../../mocks';
import { MockCogniteClient } from '../../../mocks';
import { ClientSDKProvider } from '../../ClientSDKProvider';
import { AssetScanner } from '../AssetScanner';
import { ASNotifyTypes } from '../interfaces';

class CogniteClient extends MockCogniteClient {
  assets: any = {
    list: () => ({
      autoPagingToArray: async () => {
        await sleep(1000);
        // @ts-ignore
        return assetsList;
      },
    }),
  };
}

const client = new CogniteClient({ appId: 'gearbox test' });

export const decorators = [
  (storyFn: any) => (
    <ClientSDKProvider client={client}>{storyFn()}</ClientSDKProvider>
  ),
];

export const FileInputComponent = ({ render }: any) => {
  const [image, setImage] = useState('');

  const onChange = async (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fr = new FileReader();
    fr.readAsDataURL(file);

    const uploadedImage = await new Promise(resolve => {
      fr.onloadend = res => {
        if (res) {
          resolve((res.currentTarget as any).result);
        }
      };
    });

    setImage(uploadedImage as any);
  };

  return (
    <>
      {render(image)}
      <p style={{ margin: '10px' }}>
        <input type="file" accept={'image/png'} onChange={onChange} />
      </p>
    </>
  );
};

export const ocrRequest = async ({ image }: { image: string }) => {
  console.log(image.slice(0, 10) + '...');
  return ['result'];
};

export const onError = (error: any) => {
  console.log('onError', error);
};

export const renderButton = (
  capture: Callback,
  isReady: boolean = true
): React.ReactNode => {
  const Button = styled('button')`
    border-radius: 10px;
    height: 50px;
    background-color: red;
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
  `;
  return <Button onClick={capture}>{!isReady ? 'Reset' : 'Capture'}</Button>;
};

export const customNotification = (type: ASNotifyTypes) => message.info(type);

export const onOcrError = (error: ErrorResponse) => {
  console.log('onOcrError', error);
};

export const onImageRecognizeFinish = (result: string[] | null) => {
  console.log('onImageRecognizeFinish', result);
};

export const cropSize = { width: 400, height: 200 };

export const getAssetHandlerCustom = async () => [];

export const webcamCropOverlay = () => (
  <div
    style={{
      border: '20px solid red',
      height: '240px',
      width: '440px',
    }}
  />
);

export const renderer = (image: any) => (
  <AssetScanner onError={onError} image={image} />
);
