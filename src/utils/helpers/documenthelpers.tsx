import docTypes from 'utils/helpers/docTypes.json';
import {
  Document,
  DocumentsByCategory,
  DocumentType,
  JsonDocTypes,
  Metadata,
  Priority,
} from 'utils/validators/documentTypes';

const maxDocumentTitleLength = 56;
const documentTypesOptions = ['DOC_TYPE', 'doc_type'];
const documentTitleOptions = ['DOC_TITLE', 'title'];

const getPriorityObjectFromArray = (list: string[]): Priority =>
  list.reduce((acc, p, i) => ({ ...acc, [p]: i + 1 }), {});

const sortDocsByPriority = (a: string, b: string, priority: Priority) =>
  (priority[a] || Number.MAX_SAFE_INTEGER) -
  (priority[b] || Number.MAX_SAFE_INTEGER);

const getValueFromObject = (metadata?: Metadata, arr?: string[]): string => {
  if (!metadata || !arr) {
    return '';
  }
  const data = objKeysToLowerCase(metadata);
  return arr.reduce((acc, name) => {
    if (!acc) {
      return data[name.toLowerCase()] || '';
    }
    return acc;
  }, '');
};

const objKeysToLowerCase = (obj?: Metadata): Metadata =>
  obj
    ? Object.keys(obj).reduce((acc: Metadata, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {})
    : {};

const getDocumentType = (
  metadata?: Metadata,
  documentTypeField?: string
): string => {
  const names = documentTypeField ? [documentTypeField] : documentTypesOptions;
  return getValueFromObject(metadata, names);
};

export const getCategoryName = (
  keyList: string[],
  unknownCategoryName: string = 'Unknown document type',
  types: JsonDocTypes = docTypes
): DocumentType => {
  const key = keyList.find(item => !!types[item]) || '';
  return {
    key,
    description: types[key] || unknownCategoryName,
  };
};

export const getCategoryByPriority = (
  docsByCat: DocumentsByCategory,
  priorityList: string[] = []
) => {
  const priorityObject = getPriorityObjectFromArray(priorityList);
  return Object.keys(docsByCat).sort((a, b) =>
    sortDocsByPriority(a, b, priorityObject)
  );
};

export const getDocumentsByCategory = (
  docs: Document[],
  unknownCategoryName?: string,
  types: JsonDocTypes = docTypes,
  documentTypeField?: string
): DocumentsByCategory =>
  docs.reduce((acc: DocumentsByCategory, doc) => {
    const keyList = [
      getDocumentType(doc.metadata, documentTypeField),
      // if not found try to find category in file name
      ...doc.fileName.split('-'),
    ];
    const { key, description } = getCategoryName(
      keyList,
      unknownCategoryName,
      types
    );
    const documents = acc[key] ? acc[key].documents : [];
    return {
      ...acc,
      [key]: {
        ...acc[key],
        description,
        documents: [...documents, doc],
      },
    };
  }, {});

export const getDocumentTitle = (
  metadata?: Metadata,
  documentTitleField?: string
): string => {
  const names = documentTitleField
    ? [documentTitleField]
    : documentTitleOptions;
  return getValueFromObject(metadata, names);
};

export const getShortDescription = (description: string) => {
  return description.length > maxDocumentTitleLength
    ? `${description.substring(0, maxDocumentTitleLength)}...`
    : description;
};
