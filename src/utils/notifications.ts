import { notification as antdNotification } from 'antd';

export enum NotificationTypes {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface NotificationProps {
  type: NotificationTypes;
  message: string;
  description: string;
  [name: string]: any;
}

export const notification = ({
  type = NotificationTypes.INFO,
  message,
  description,
  ...props
}: NotificationProps) => {
  antdNotification[type]({
    message,
    key: message,
    description,
    ...props,
  });
};

export const ocrError = {
  type: NotificationTypes.ERROR,
  message: 'Failed to scan image',
  description: 'Check your API key configuration for Google Vision',
};

export const ocrNoTextFound = {
  type: NotificationTypes.WARNING,
  message: 'Failed to find any text in the image',
  description: 'Low lighting and worn tags might cause this',
};

export const ocrAssetNotFind = {
  type: NotificationTypes.WARNING,
  message: 'Oops, could not match the text in that picture to any tag',
  description:
    'Worn tags, low lighting might cause poor tag matching. Please try again!',
};

export const ocrSuccess = {
  type: NotificationTypes.SUCCESS,
  message: 'Found text in image',
  description: `Querying the Cognite data platform for matches`,
};

export const ocrAssetFind = {
  type: NotificationTypes.SUCCESS,
  message: 'Assets have been found',
  description: `Few assets have been found on recognized image`,
};

export const ocrErrorVideo = {
  type: NotificationTypes.WARNING,
  message: 'Camera access has been denied',
  description: 'Please, allow application to use camera on your device',
};
