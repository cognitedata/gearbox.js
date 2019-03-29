import 'antd/dist/antd.css';
import Collapse from 'antd/lib/collapse';
import React from 'react';
import styled from 'styled-components';
import { Document, DocumentTableProps } from 'utils/validators/documentTypes';
import {
  getCategoryByPriority,
  getDocumentsByCategory,
  getDocumentTitle,
  getShortDescription,
} from 'utils/helpers/documenthelpers';

const { Panel } = Collapse;

interface DocumentTableState {
  stateParam?: string;
}

class DocumentTable extends React.PureComponent<
  DocumentTableProps,
  DocumentTableState
> {
  static defaultProps = {
    handleDocumentClick: () => null,
  };

  renderDocument = (category: string, description: string) => (
    document: Document,
    i: number,
    all: Document[]
  ) => {
    const { documentRenderer } = this.props;
    if (documentRenderer) {
      return documentRenderer(document, i, all);
    }

    const { documentTitleField, handleDocumentClick } = this.props;

    return (
      <LinkContainer key={document.id}>
        <LinkStyle
          key={document.id}
          data-test-id="file-name"
          onClick={() =>
            handleDocumentClick
              ? handleDocumentClick(document, category, description)
              : null
          }
          tabIndex={-1}
        >
          {document.fileName}
        </LinkStyle>
        <TextContainerTop data-test-id="document-title">
          {getDocumentTitle(document.metadata, documentTitleField)}
        </TextContainerTop>
      </LinkContainer>
    );
  };

  render() {
    const {
      docs,
      categoryPriorityList,
      unknownCategoryName,
      documentTypeField,
      docTypes,
      noDocumentsSign,
      collapseProps,
    } = this.props;
    const documentsByCategory = getDocumentsByCategory(
      docs || [],
      unknownCategoryName,
      docTypes,
      documentTypeField
    );
    const categoryByPriority = getCategoryByPriority(
      documentsByCategory,
      categoryPriorityList
    );

    if (!categoryByPriority.length) {
      return (
        <NoDocuments data-test-id="no-documents">{`${
          noDocumentsSign
            ? noDocumentsSign
            : 'No documents linked to this asset'
        }`}</NoDocuments>
      );
    }

    return (
      <React.Fragment>
        <TableWrapper>
          <CollapseContainer {...collapseProps}>
            {categoryByPriority.map(category => {
              const { description, documents } = documentsByCategory[category];
              const header = `${getShortDescription(description)} (${
                documents.length
              })`;
              return (
                <PanelWrapper header={header} key={category}>
                  {documents.map(this.renderDocument(category, description))}
                </PanelWrapper>
              );
            })}
          </CollapseContainer>
        </TableWrapper>
      </React.Fragment>
    );
  }
}

export default DocumentTable;

const TableWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const LinkContainer = styled.div`
  display: flex;
  margin: 10px 0;
  white-space: nowrap;
`;

const CollapseContainer = styled(Collapse)`
  width: 100%;
`;

const TextContainerTop = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`;

const PanelWrapper = styled(Panel)`
  text-align: left;
`;

const LinkStyle = styled.a`
  font-size: 1.125em;
  margin-right: 10px;
`;

const NoDocuments = styled.div`
  padding: 16px;
`;
