import moment from 'moment-timezone';

export function formatDatetime(
  time: number | string | Date,
  defaultValue: string = '',
  timezone: string = '',
  format: string = 'MMM D, YYYY HH:mm:ss'
): string {
  return time
    ? moment(time)
        .tz(timezone || moment.tz.guess())
        .format(format)
    : defaultValue;
}

export function momentFromTimestamp(timestamp: number) {
  return moment(timestamp).tz('utc');
}
