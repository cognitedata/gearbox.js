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
   * Categories to display on top. Can be used for sorting as well
   */
  unknownCategoryName?: string;
  /**
   * Category names to be expanded by default.
   */
  expandedCategories?: string[];
}
