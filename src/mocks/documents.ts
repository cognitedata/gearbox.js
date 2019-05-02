function generateDocumentBase(id: number) {
  return {
    id,
    fileName: `file name ${id}`,
  };
}

export function generateDocumentWithMetadata(
  id: number,
  metadata: { [key: string]: string }
) {
  return {
    ...generateDocumentBase(id),
    metadata,
  };
}

export function generateDocumentWithDocType(
  id: number,
  title: null | string,
  type: null | string
) {
  const metadata: { [key: string]: string } = {};
  if (title) {
    metadata.DOC_TITLE = title;
  }
  if (type) {
    metadata.DOC_TYPE = type;
  }
  return generateDocumentWithMetadata(id, metadata);
}

export const DOCUMENTS = [
  {
    ...generateDocumentBase(1),
    metadata: {
      DOC_TITLE: 'document title 1',
      DOC_TYPE: 'XG',
    },
  },
  {
    ...generateDocumentBase(2),
    metadata: {
      DOC_TITLE: 'document title 2',
      DOC_TYPE: 'XB',
    },
  },
  {
    ...generateDocumentBase(3),
    metadata: {
      DOC_TITLE: 'document title 3',
      DOC_TYPE: 'XG',
    },
  },
  {
    ...generateDocumentBase(4),
    metadata: {
      DOC_TITLE: 'document title 4',
      DOC_TYPE: 'AB',
    },
  },
];

export const DOCUMENT_WITHOUT_TYPE = {
  ...generateDocumentBase(1),
  metadata: {
    DOC_TITLE: 'document title 1',
  },
};

export const DOCUMENT_WITHOUT_METADATA = generateDocumentBase(1);

export const DOCUMENT_WITH_CUSTOM_TYPE_FIELD = {
  ...generateDocumentBase(1),
  metadata: {
    Type: 'XB',
  },
};

export const DOCUMENT_WITH_CUSTOM_TITLE_FIELD = {
  ...generateDocumentBase(1),
  metadata: {
    Title: 'Document title',
  },
};
