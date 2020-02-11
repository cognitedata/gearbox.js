import React, { FC } from 'react';
import { DescriptionListProps } from '../interfaces';

export const metadata = {
  SOURCE_DB: 'workmate',
  SOURCE_TABLE: 'wmate_dba.wmt_location',
  WMT_LOCATION_ID: '1004',
  WMT_LOCATION_WORKSTART: '1999-09-01 07:00:00',
  latestUpdateTimeSource: '1552471210000',
};

export const description = {
  descriptionId: 'list1',
  descriptionText: 'List with interesting data you might like to know.',
};

export const sourceCategory = 'Source data';

export const otherCategory = 'Other';

export const toCategory = (name: string) =>
  name.includes('SOURCE') ? sourceCategory : undefined;

export const ComponentProps: FC<DescriptionListProps> = () => <></>;
