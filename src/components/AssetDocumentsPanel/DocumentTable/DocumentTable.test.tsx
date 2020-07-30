// Copyright 2020 Cognite AS
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {
  DOCUMENT_WITH_CUSTOM_TITLE_FIELD,
  DOCUMENT_WITH_CUSTOM_TYPE_FIELD,
  DOCUMENT_WITHOUT_METADATA,
  DOCUMENT_WITHOUT_TYPE,
  DOCUMENTS,
  generateDocumentWithDocType,
} from '../../../mocks';
import { DocumentTable } from './DocumentTable';

configure({ adapter: new Adapter() });

const ANT_COLLAPSE_HEADER = '.ant-collapse-header';

describe('DocumentTable', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(<DocumentTable assetFiles={[]} />);
    expect(wrapper).toHaveLength(1);
  });

  it('Correctly renders unknown category', () => {
    const wrapper = mount(
      <DocumentTable assetFiles={[DOCUMENT_WITHOUT_TYPE]} />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('Unknown document type (1)');
  });

  it('Correctly renders custom unknown category', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[DOCUMENT_WITHOUT_TYPE]}
        unknownCategoryName="Unknown"
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('Unknown (1)');
  });

  it('Correctly renders without metadata', () => {
    const wrapper = mount(
      <DocumentTable assetFiles={[DOCUMENT_WITHOUT_METADATA]} />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('Unknown document type (1)');
  });

  it('Correctly finds type in name', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[
          // @ts-ignore
          {
            id: 1,
            name: 'DN02-SM-P-XB-2103-01-11L.svg',
          },
        ]}
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('P&ID (1)');
  });

  it('Correctly finds category from custom field', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[DOCUMENT_WITH_CUSTOM_TYPE_FIELD]}
        documentTypeField="Type"
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('P&ID (1)');
  });

  it('Correctly finds title from custom field', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[DOCUMENT_WITH_CUSTOM_TITLE_FIELD]}
        documentTitleField="Title"
      />
    );
    wrapper
      .find(ANT_COLLAPSE_HEADER)
      .hostNodes()
      .simulate('click');
    expect(
      wrapper
        .find('[data-test-id="document-title"]')
        .hostNodes()
        .text()
    ).toBe('Document title');
  });

  it('Correctly finds types from custom docTypes', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[
          // @ts-ignore
          {
            id: 1,
            name: 'file name 1',
            metadata: {
              DOC_TITLE: 'document title 1',
              DOC_TYPE: 'Test',
            },
          },
        ]}
        docTypes={{
          Test: 'foo',
        }}
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .text()
    ).toBe('foo (1)');
  });

  it('Correctly prioritize based on categoryPriorityList', () => {
    const wrapper = mount(
      <DocumentTable
        assetFiles={[
          generateDocumentWithDocType(1, 'a', 'XB'),
          generateDocumentWithDocType(2, 'b', 'FA'),
        ]}
        categoryPriorityList={['FA', 'XB']}
      />
    );
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .first()
        .text()
    ).toBe('Project manual, e.g. principal decisions (1)');
    expect(
      wrapper
        .find(ANT_COLLAPSE_HEADER)
        .hostNodes()
        .last()
        .text()
    ).toBe('P&ID (1)');
  });

  it('Document clicked with expected props', () => {
    const handleDocumentClick = jest.fn();
    const wrapper = mount(
      <DocumentTable
        assetFiles={[generateDocumentWithDocType(1, null, 'XB')]}
        handleDocumentClick={handleDocumentClick}
      />
    );
    wrapper
      .find(ANT_COLLAPSE_HEADER)
      .hostNodes()
      .simulate('click');
    wrapper
      .find('[data-test-id="file-name"]')
      .hostNodes()
      .simulate('click');
    expect(handleDocumentClick.mock.calls[0][1]).toBe('XB');
    expect(handleDocumentClick.mock.calls[0][2]).toBe('P&ID');
  });

  it('No documents linked sign shown properly', () => {
    const wrapper = mount(
      <DocumentTable assetFiles={[]} noDocumentsSign="None" />
    );
    expect(
      wrapper
        .find('[data-test-id="no-documents"]')
        .hostNodes()
        .text()
    ).toBe('None');
  });

  it('Category click is fired', () => {
    const handleCategoryClick = jest.fn();
    const wrapper = mount(
      <DocumentTable
        assetFiles={[generateDocumentWithDocType(1, null, 'XB')]}
        collapseProps={{
          onChange: handleCategoryClick,
        }}
      />
    );
    wrapper
      .find(ANT_COLLAPSE_HEADER)
      .hostNodes()
      .simulate('click');
    expect(handleCategoryClick.mock.calls[0][0]).toEqual(['XB']);
  });

  it('Should sort categories with custom sort', () => {
    const customCategorySort = (a: string, b: string) =>
      a > b ? -1 : a < b ? 1 : 0;
    const wrapper = mount(
      <DocumentTable
        assetFiles={DOCUMENTS}
        categoryPriorityList={[]}
        customCategorySort={customCategorySort}
      />
    );
    const categories = wrapper
      .find(ANT_COLLAPSE_HEADER)
      .hostNodes()
      .map(node => node.text());
    for (let i = 0; i < categories.length - 1; i++) {
      expect(customCategorySort(categories[i], categories[i + 1])).not.toBe(1);
    }
  });
});
