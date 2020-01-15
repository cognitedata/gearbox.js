import { CSSProperties } from 'react';
import { AnyIfEmpty } from '../../interfaces';

export interface ValueListType {
  key?: string;
  name: string;
  value: string;
}

export interface MetaDescriptionListProps {
  /**
   * A custom categorization function (e.g. to collapse specific props)
   */
  toCategory?: (name: string) => string | undefined;
  /**
   * Categories to display on top. Can be used for sorting as well
   */
  categoryPriorityList?: string[];
  /**
   * A category name for uncategorised items
   */
  unknownCategoryName?: string;
  /**
   * Category names to be expanded by default
   */
  expandedCategories?: string[];
}

export interface DescriptionListProps extends MetaDescriptionListProps {
  /**
   * An object with properties to render
   */
  valueSet: { [name: string]: any };
  /**
   * An object with two properties
   * descriptionId and descriptionText to display above the table
   */
  description?: {
    descriptionId: string;
    descriptionText: string;
  };
  /**
   * Custom style object to style component wrapper
   */
  styles?: CSSProperties;
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}
