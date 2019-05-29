import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { message } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Callback, ErrorResponse } from '../../../interfaces';
import { ASNotifyTypes, AssetScanner } from '../AssetScanner';

import * as customButtonDoc from './custom-button.md';
import * as full from './full.md';
import * as customNotificationsDoc from './notifications.md';
import * as ocrRequestDoc from './ocr-request.md';

const onOcrError = (error: ErrorResponse) => {
  action('onOcrError')(error);
};
const ocrRequest = ({ image }: { image: string }) => {
  action('ocrRequest')(image.slice(0, 10) + '...');

  return Promise.resolve(['result']);
};

const onImageRecognizeFinish = (result: string[] | null) => {
  action('onImageRecognizeFinish')(result);
};

const onError = (error: any) => {
  action('onError')(error);
};

const renderButton = (capture: Callback, image?: string): React.ReactNode => {
  const Button = styled('button')`
    border-radius: 10px;
    height: 50px;
    background-color: red;
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
  `;
  return <Button onClick={capture}>{image ? 'Reset' : 'Capture'}</Button>;
};

const customNotification: (type: ASNotifyTypes) => any = (
  type: ASNotifyTypes
) => {
  const notifications: { [name in ASNotifyTypes]: any } = {
    [ASNotifyTypes.recognizeSuccess]: () => {
      action('notification')('recognizeSuccess');
      message.info('recognizeSuccess');
    },
    [ASNotifyTypes.recognizeFails]: () => {
      action('notification')('recognizeFails');
      message.info('recognizeFails');
    },
    [ASNotifyTypes.assetsFind]: () => {
      action('notification')('assetsFind');
      message.info('assetsFind');
    },
    [ASNotifyTypes.assetsEmpty]: () => {
      action('notification')('assetsEmpty');
      message.info('assetsEmpty');
    },
    [ASNotifyTypes.errorVideoAccess]: () => {
      action('notification')('errorVideoAccess');
      message.info('errorVideoAccess');
    },
    [ASNotifyTypes.errorOccurred]: () => {
      action('notification')('errorOccurred');
      message.info('errorOccurred');
    },
  };

  return notifications[type]();
};

storiesOf('AssetScanner', module).add(
  'Full description',
  () => (
    <AssetScanner onOcrError={onOcrError} ocrKey={'YOUR_GOOGLE_VISION_KEY'} />
  ),
  {
    readme: {
      content: full,
    },
  }
);

storiesOf('AssetScanner/Examples', module)
  .add(
    'Custom ocrRequest',
    () => (
      <AssetScanner
        onError={onError}
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
      />
    ),
    {
      readme: {
        content: ocrRequestDoc,
      },
    }
  )
  .add(
    'Custom button',
    () => (
      <AssetScanner
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
        button={renderButton}
      />
    ),
    {
      readme: {
        content: customButtonDoc,
      },
    }
  )
  .add(
    'Custom notifications',
    () => (
      <AssetScanner
        onOcrError={onOcrError}
        ocrKey={'YOUR_GOOGLE_VISION_KEY'}
        customNotification={customNotification}
      />
    ),
    {
      readme: {
        content: customNotificationsDoc,
      },
    }
  );
