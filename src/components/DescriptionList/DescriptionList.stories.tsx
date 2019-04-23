import { storiesOf } from '@storybook/react';
import React from 'react';
import { ASSET_DATA } from '../../mocks';
import { DescriptionList } from './DescriptionList';

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
