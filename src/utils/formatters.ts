import moment from 'moment';
import { PureObject } from '../interfaces';

type TimeType = number | string | Date;

export function formatDatetime(
  time: TimeType | undefined,
  defaultValue: string = '',
  format: string = 'MMM D, YYYY HH:mm:ss'
): string {
  return time ? moment(time).format(format) : defaultValue;
}

export function momentFromTimestamp(timestamp: number) {
  return moment(timestamp);
}

export const mapMetaData = (metaObject: PureObject) =>
  Object.keys(metaObject).map(dp => ({
    key: dp,
    name: dp,
    value: (metaObject as any)[dp],
  }));
