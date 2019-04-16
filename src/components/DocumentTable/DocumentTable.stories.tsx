import { storiesOf } from '@storybook/react';
import React from 'react';
import { DocumentTable } from './DocumentTable';
import { DOCUMENTS } from '../../mocks';

storiesOf('DocumentTable', module)
  .add('Basic', () => <DocumentTable docs={DOCUMENTS} />)
  .add(
    'Custom renderer',
    () => (
      <DocumentTable
        docs={DOCUMENTS}
        documentRenderer={(document, i) => (
          <div>
            <h2>Document #{i + 1}</h2>
            <pre>{JSON.stringify(document, null, 2)}</pre>
          </div>
        )}
      />
    ),
    {
      info: {
        text:
          'documentRenderer needs to be function returning ReactNode. \n' +
          'Inputs are document, i (index) and documents (array of document). \n' +
          'Function used in this documentrenderer: (document, i) => (\n' +
          '          <div>\n' +
          '            <h2>Document #{i + 1}</h2>\n' +
          '            <pre>{JSON.stringify(document, null, 2)}</pre>\n' +
          '          </div>\n' +
          '        )}',
      },
    }
  )
  .add('No borders', () => (
    <DocumentTable docs={DOCUMENTS} collapseProps={{ bordered: false }} />
  ));
