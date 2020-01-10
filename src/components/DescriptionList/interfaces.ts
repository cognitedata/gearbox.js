import { CSSProperties } from 'react';
import { AnyIfEmpty } from '../../interfaces';

export interface ValueListType {
  key?: string;
  name: string;
  value: string;
}

export interface MetaDescriptionListProps {
  toCategory?: (name: string) => string | undefined;
  categoryPriorityList?: string[];
  unknownCategoryName?: string;
  expandedCategories?: string[];
}

export interface DescriptionListProps extends MetaDescriptionListProps {
  description?: {
    descriptionId: string;
    descriptionText: string;
  };
  valueSet: { [name: string]: any };
  styles?: CSSProperties;
  theme?: AnyIfEmpty<{}>;
}
