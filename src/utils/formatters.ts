import moment from 'moment-timezone';

// TODO #920 determine default formatting from moment's locale data set
// based on user selection, instead of this hard coded string.. or something
// Out of all the formats that currently exist in ths app, this one is the least
// ambiguous to the user.
export function formatDatetime(
  time: number | string | Date,
  defaultValue: string = '',
  timezone: string = ''
): string {
  return time
    ? moment(time)
        .tz(timezone || moment.tz.guess())
        .format('MMM D, YYYY HH:mm:ss')
    : defaultValue;
}

export function momentFromTimestamp(timestamp: number) {
  return moment(timestamp).tz('utc');
}
