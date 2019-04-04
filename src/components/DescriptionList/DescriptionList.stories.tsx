import React from 'react';
import { storiesOf } from '@storybook/react';
import DescriptionList from 'components/DescriptionList/DescriptionList';
import { ASSET_DATA } from 'mocks/assets';

storiesOf('DescriptionList', module)
  .add('Basic example', () => (
    <DescriptionList valueSet={ASSET_DATA.metadata} />
  ))
  .add('No data', () => <DescriptionList valueSet={[]} />)
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
      info: {
        text:
          'The description-text above is linked to the list by aria-describedby. ' +
          'descriptionId will be the reference to the text - ' +
          'in case you have several description lists on one page.' +
          'You could also style it however you like with a specfic id-reference.',
      },
    }
  );
