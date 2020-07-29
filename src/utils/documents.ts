// Copyright 2020 Cognite AS
import {
  Document,
  DocumentsByCategory,
  DocumentType,
  JsonDocTypes,
  Priority,
} from '../components/AssetDocumentsPanel';
import { PureObject } from '../interfaces';
import { docTypes } from './resources/docTypes';
import { sortStringsAlphabetically } from './utils';

const maxDocumentTitleLength = 56;
const documentTypesOptions = ['DOC_TYPE', 'doc_type'];
const documentTitleOptions = ['DOC_TITLE', 'title'];

const getPriorityObjectFromArray = (list: string[]): Priority =>
  list.reduce((acc, p, i) => ({ ...acc, [p]: i + 1 }), {});

const sortDocsByPriority = (
  a: string,
  b: string,
  priority: Priority
): number => {
  return (
    (priority[a] || Number.MAX_SAFE_INTEGER) -
    (priority[b] || Number.MAX_SAFE_INTEGER)
  );
};

const getValueFromObject = (metadata?: PureObject, arr?: string[]): string => {
  if (!metadata || !arr) {
    return '';
  }
  const data = objKeysToLowerCase(metadata);

  return arr.reduce((acc: string, name: string): string => {
    if (!acc) {
      return data[name.toLowerCase()]
        ? data[name.toLowerCase()].toString()
        : '';
    }
    return acc;
  }, '');
};

const objKeysToLowerCase = (obj?: PureObject): PureObject =>
  obj
    ? Object.keys(obj).reduce((acc: PureObject, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {})
    : {};

const getDocumentType = (
  metadata?: PureObject,
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
  priorityList: string[] = [],
  customSort?: (a: string, b: string) => number
): { categories: string[]; prioritizedCount: number } => {
  const priorityObject = getPriorityObjectFromArray(priorityList);
  const prioritizedCategories: string[] = [];
  const regularCategories: string[] = [];
  for (const category of Object.keys(docsByCat)) {
    if (priorityObject[category] !== undefined) {
      prioritizedCategories.push(category);
    } else {
      regularCategories.push(category);
    }
  }
  const sortFunction = customSort || sortStringsAlphabetically;
  return {
    categories: prioritizedCategories
      .sort((a, b) => sortDocsByPriority(a, b, priorityObject))
      .concat(
        regularCategories.sort((a, b) =>
          sortFunction(docsByCat[a].description, docsByCat[b].description)
        )
      ),
    prioritizedCount: prioritizedCategories.length,
  };
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
      ...doc.name.split('-'),
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
  metadata?: PureObject,
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
