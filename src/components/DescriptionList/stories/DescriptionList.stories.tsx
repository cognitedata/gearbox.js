import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA } from '../../../mocks';
import { DescriptionList } from '../DescriptionList';

import basic from './basic.md';
import fullDescription from './full.md';
import noData from './noData.md';
import withDescriptionText from './withDescriptionText.md';

storiesOf('DescriptionList', module).add(
  'Full Description',
  () => <DescriptionList valueSet={ASSET_DATA.metadata} />,
  {
    readme: {
      content: fullDescription,
    },
  }
);

storiesOf('DescriptionList/Examples', module)
  .add('Basic', () => <DescriptionList valueSet={ASSET_DATA.metadata} />, {
    readme: {
      content: basic,
    },
  })
  .add('No data', () => <DescriptionList valueSet={{}} />, {
    readme: {
      content: noData,
    },
  })
  .add(
    'With description text',
    () => (
      <DescriptionList
        valueSet={ASSET_DATA.metadata}
        description={{
          descriptionId: 'list1',
          descriptionText: 'List with interesting data you might like to know.',
        }}
      />
    ),
    {
      readme: {
        content: withDescriptionText,
      },
    }
  );
