import { storiesOf } from '@storybook/react';
import React from 'react';
import DocumentTable from 'components/DocumentTable/DocumentTable';

storiesOf('DocumentTable', module)
  .add('Basic', () => (
    <DocumentTable
      docs={[
        {
          id: 1,
          fileName: 'file name 1',
          metadata: {
            DOC_TITLE: 'document title 1',
            DOC_TYPE: 'XG',
          },
        },
        {
          id: 2,
          fileName: 'file name 2',
          metadata: {
            DOC_TITLE: 'document title 2',
            DOC_TYPE: 'XB',
          },
        },
        {
          id: 3,
          fileName: 'file name 3',
          metadata: {
            DOC_TITLE: 'document title 3',
            DOC_TYPE: 'XG',
          },
        },
      ]}
    />
  ))
  .add('Custom renderer', () => (
    <DocumentTable
      docs={[
        {
          id: 1,
          fileName: 'file name 1',
          metadata: {
            DOC_TITLE: 'document title 1',
            DOC_TYPE: 'XG',
          },
        },
        {
          id: 2,
          fileName: 'file name 2',
          metadata: {
            DOC_TITLE: 'document title 2',
            DOC_TYPE: 'XB',
          },
        },
        {
          id: 3,
          fileName: 'file name 3',
          metadata: {
            DOC_TITLE: 'document title 3',
            DOC_TYPE: 'XG',
          },
        },
      ]}
      documentRenderer={(document, i) => (
        <div>
          <h1>Document #{i + 1}</h1>
          <pre>{JSON.stringify(document, null, 2)}</pre>
        </div>
      )}
    />
  ))
  .add('No borders', () => (
    <DocumentTable
      docs={[
        {
          id: 1,
          fileName: 'file name 1',
          metadata: {
            DOC_TITLE: 'document title 1',
            DOC_TYPE: 'XG',
          },
        },
        {
          id: 2,
          fileName: 'file name 2',
          metadata: {
            DOC_TITLE: 'document title 2',
            DOC_TYPE: 'XB',
          },
        },
        {
          id: 3,
          fileName: 'file name 3',
          metadata: {
            DOC_TITLE: 'document title 3',
            DOC_TYPE: 'XG',
          },
        },
      ]}
      collapseProps={{ bordered: false }}
    />
  ));
