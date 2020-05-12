export const defaultStrings = {
  title: 'Export chart data',
  labelRange: 'Range',
  labelGranularity: 'Label Granularity',
  labelGranularityHelp: 'Example inputs: 15s, 1m, 5h, 2d',
  formatTimestamp: 'Format timestamp?',
  formatTimestampHelp: 'e.g. 2018-04-02_12:20:20',
  delimiterLabel: 'Select delimiter',
  delimiterHelp: 'The character that will separate your data fields',
  csvDownload: 'Download as CSV',
  csvDownloadInProgress: 'Download as CSV',
  closeBtn: 'Close',
  imageDownloadLabel: 'Image download',
  imageDownloadBtn: 'Download as SVG',
  /** @deprecated Cell-limit no longer exists. */
  cellLimitErr:
    'You hit the limit of {{ cellLimit }} datapoints - some data may be omitted',
};

export type Strings = typeof defaultStrings;
