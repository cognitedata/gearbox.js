import { Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { WithAssetFilesDataProps } from '../../../hoc/withAssetFiles';
import { withDefaultTheme } from '../../../hoc/withDefaultTheme';
import {
  AnyIfEmpty,
  AssetDocumentsPanelStyles,
  Document,
  MetaDocProps,
} from '../../../interfaces';
import { defaultTheme } from '../../../theme/defaultTheme';
import {
  getCategoryByPriority,
  getDocumentsByCategory,
  getDocumentTitle,
  getShortDescription,
} from '../../../utils/documents';

const { Panel } = Collapse;

export interface DocumentsPanelStylesProps {
  styles?: AssetDocumentsPanelStyles;
}

export interface DocumentsPanelThemeProps {
  theme?: AnyIfEmpty<{}>;
}

export type DocumentTableProps = MetaDocProps &
  WithAssetFilesDataProps &
  DocumentsPanelStylesProps &
  DocumentsPanelThemeProps;

interface DocumentTableState {
  stateParam?: string;
}

class DocumentTable extends React.PureComponent<
  DocumentTableProps,
  DocumentTableState
> {
  static defaultProps = {
    handleDocumentClick: () => null,
    categoryPriorityList: ['XB', 'XL'], // categories "P&ID" and "Logic Diagrams" are prioritized by default
    theme: { ...defaultTheme },
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

    const { documentTitleField, handleDocumentClick, styles } = this.props;

    return (
      <LinkContainer key={document.id} style={styles && styles.fileContainer}>
        <LinkStyle
          key={document.id}
          data-test-id="file-name"
          onClick={() =>
            handleDocumentClick
              ? handleDocumentClick(document, category, description)
              : null
          }
          tabIndex={-1}
          style={styles && styles.fileLink}
        >
          {document.fileName}
        </LinkStyle>
        <TextContainerTop
          data-test-id="document-title"
          style={styles && styles.fileTitle}
        >
          {getDocumentTitle(document.metadata, documentTitleField)}
        </TextContainerTop>
      </LinkContainer>
    );
  };

  render() {
    const {
      assetFiles,
      categoryPriorityList,
      unknownCategoryName,
      documentTypeField,
      docTypes,
      noDocumentsSign,
      collapseProps,
      customCategorySort,
      styles,
    } = this.props;

    const documentsByCategory = getDocumentsByCategory(
      assetFiles || [],
      unknownCategoryName,
      docTypes,
      documentTypeField
    );
    const { categories, prioritizedCount } = getCategoryByPriority(
      documentsByCategory,
      categoryPriorityList,
      customCategorySort
    );

    if (!categories.length) {
      return (
        <NoDocuments data-test-id="no-documents">{`${
          noDocumentsSign
            ? noDocumentsSign
            : 'No documents linked to this asset'
        }`}</NoDocuments>
      );
    }

    return (
      <>
        <TableWrapper>
          <CollapseContainer {...collapseProps}>
            {categories.map((category, i) => {
              const { description, documents } = documentsByCategory[category];
              const header = `${getShortDescription(description)} (${
                documents.length
              })`;
              return (
                <PanelWrapper
                  header={header}
                  key={category}
                  delimiter={
                    prioritizedCount === i + 1 &&
                    prioritizedCount !== categories.length
                  }
                  style={styles && styles.wrapper}
                >
                  {documents.map(this.renderDocument(category, description))}
                </PanelWrapper>
              );
            })}
          </CollapseContainer>
        </TableWrapper>
      </>
    );
  }
}

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

const PanelWrapper = styled(Panel)<{ delimiter: boolean }>`
  text-align: left;
  ${({ delimiter }) =>
    delimiter ? 'border-bottom: 2px solid #CFCFCF !important;' : ''}
`;

const LinkStyle = styled.a`
  font-size: 1.125em;
  margin-right: 10px;
`;

const NoDocuments = styled.div`
  padding: 16px;
`;

const Component = withDefaultTheme(DocumentTable);
Component.displayName = 'DocumentTable';

export { Component as DocumentTable };
