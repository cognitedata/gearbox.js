import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { message } from 'antd';
import React, { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';
import { Callback, ErrorResponse } from '../../../interfaces';
import { ASNotifyTypes, AssetScanner } from '../AssetScanner';

import customButtonDoc from './custom-button.md';
import full from './full.md';
import customNotificationsDoc from './notifications.md';
import ocrRequestDoc from './ocr-request.md';

const FileInputComponent = (props: any) => {
  const [image, setImage] = useState('');

  const onChange = async (e: SyntheticEvent) => {
    // @ts-ignore
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const fr = new FileReader();
    fr.readAsDataURL(file);

    const uploadedImage = await new Promise(resolve => {
      fr.onloadend = res => {
        if (res) {
          // @ts-ignore
          resolve(res.currentTarget.result);
        }
      };
    });

    // @ts-ignore
    setImage(uploadedImage);
  };

  return (
    <>
      {props.render(image)}
      <p style={{ margin: '10px' }}>
        <input type="file" accept={'image/png'} onChange={onChange} />
      </p>
    </>
  );
};

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

const renderButton = (
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
      onOcrError={onOcrError}
      enableNotification={true}
      ocrKey={'YOUR_GOOGLE_VISION_KEY'}
    />
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
    'Notification',
    () => (
      <AssetScanner
        onOcrError={onOcrError}
        ocrKey={'YOUR_GOOGLE_VISION_KEY'}
        enableNotification={true}
        customNotification={customNotification}
      />
    ),
    {
      readme: {
        content: customNotificationsDoc,
      },
    }
  )
  .add('Input image', () => (
    <FileInputComponent
      render={(image: string) => (
        <AssetScanner
          onError={onError}
          ocrRequest={ocrRequest}
          onImageRecognizeFinish={onImageRecognizeFinish}
          image={image}
        />
      )}
    />
  ))
  .add(
    'Crop placeholder',
    () => (
      <AssetScanner
        onError={onError}
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
        cropSize={{ width: 400, height: 200 }}
      />
    ),
    {
      readme: {
        content: ocrRequestDoc,
      },
    }
  )
  .add(
    'Horizontal placeholder with custom button',
    () => (
      <AssetScanner
        onError={onError}
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
        cropSize={{ width: 800, height: 250 }}
        button={renderButton}
      />
    ),
    {
      readme: {
        content: ocrRequestDoc,
      },
    }
  )
  .add(
    'Vertical crop placeholder with custom button',
    () => (
      <AssetScanner
        onError={onError}
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
        cropSize={{ width: 200, height: 400 }}
        button={renderButton}
      />
    ),
    {
      readme: {
        content: ocrRequestDoc,
      },
    }
  )
  .add(
    'Crop placeholder with custom overlay',
    () => (
      <AssetScanner
        onError={onError}
        ocrRequest={ocrRequest}
        onImageRecognizeFinish={onImageRecognizeFinish}
        cropSize={{ width: 200, height: 400 }}
        button={renderButton}
        webcamCropOverlay={() => (
          <div
            style={{
              border: '20px solid red',
              height: '440px',
              width: '240px',
            }}
          />
        )}
      />
    ),
    {
      readme: {
        content: ocrRequestDoc,
      },
    }
  );
