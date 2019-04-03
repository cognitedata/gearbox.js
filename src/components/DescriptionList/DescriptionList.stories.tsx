import React from 'react';
import { storiesOf } from '@storybook/react';
import DescriptionList from 'components/DescriptionList/DescriptionList';
import { ASSET_META_DATA_SOURCE } from 'mocks/assets';

const values = [
  {
    name: 'name 1',
    value: 'value 1',
  },
  {
    name: 'name 2',
    value: 'value 2',
    key: 'key2',
  },
];

storiesOf('DescriptionList', module)
  .add('Basic example', () => <DescriptionList valueSet={values} />)
  .add('No data', () => <DescriptionList valueSet={[]} />)
  .add('With Asset data', () => (
    <DescriptionList valueSet={ASSET_META_DATA_SOURCE} />
  ))
  .add(
    'With description',
    () => (
      <DescriptionList
        valueSet={values}
        description={{
          descriptionId: 'list1',
          descriptionText: 'List with interesting data you might like to know.',
        }}
      />
    ),
    {
      info: {
        text:
          'The description-text above is linked to the list by aria-describedby. ' +
          'descriptionId will be the reference to the text - ' +
          'in case you have several description lists on one page.' +
          'You could also style it however you like with a specfic id-reference.',
      },
    }
  );
