import { storiesOf } from '@storybook/react';
import React from 'react';
import { ValueListType } from '../../../interfaces/AssetTypes';
import { ASSET_DATA } from '../../../mocks';
import { DescriptionList } from '../DescriptionList';

import basic from './basic.md';
import fullDescription from './full.md';
import noData from './noData.md';
import withCustomCategories from './withCustomCategories.md';
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
  )
  .add(
    'With custom categories',
    () => {
      const sourceCategory = 'Source data';
      const otherCategory = 'Other';
      function toCategory(property: ValueListType) {
        if (property.name.indexOf('SOURCE') > -1) {
          return sourceCategory;
        }
      }
      return (
        <DescriptionList
          valueSet={ASSET_DATA.metadata}
          toCategory={toCategory}
          unknownCategoryName={otherCategory}
          expandedCategories={[otherCategory]}
          categoryPriorityList={[sourceCategory]}
        />
      );
    },
    {
      readme: {
        content: withCustomCategories,
      },
    }
  );
