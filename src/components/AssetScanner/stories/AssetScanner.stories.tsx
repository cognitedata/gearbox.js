import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { message } from 'antd';
import React from 'react';
import { ErrorResponse } from '../../../interfaces';
import { ASNotifyTypes, AssetScanner } from '../AssetScanner';

import * as full from './full.md';
import * as customNotificationsDoc from './notifications.md';

const onUnauthorized: any = (error: ErrorResponse) => {
  action('onUnauthorized')(error);
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
    <AssetScanner
      onUnauthorized={onUnauthorized}
      ocrKey={'YOUR_GOOGLE_VISION_KEY'}
    />
  ),
  {
    readme: {
      content: full,
    },
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  }
);

storiesOf('AssetScanner/Examples', module)
  .addParameters({
    info: {
      header: false,
      source: false,
      styles: {
        infoBody: { display: 'none' },
      },
    },
  })
  .add(
    'Custom notifications',
    () => (
      <AssetScanner
        onUnauthorized={onUnauthorized}
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
