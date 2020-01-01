import { Collapse } from 'antd';
import { Dictionary, groupBy } from 'lodash';
import React, { CSSProperties, FC, Fragment } from 'react';
import styled from 'styled-components';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import {
  AnyIfEmpty,
  MetaDescriptionListProps,
  ValueListType,
} from '../../interfaces';
import { mapMetaData } from '../../utils/formatters';
const { Panel } = Collapse;

export interface DescriptionListProps extends MetaDescriptionListProps {
  description?: {
    descriptionId: string;
    descriptionText: string;
  };
  valueSet: { [name: string]: any };
  styles?: CSSProperties;
  theme?: AnyIfEmpty<{}>;
}

const DescriptionList: FC<DescriptionListProps> = ({
  styles,
  valueSet,
  toCategory,
  description,
  expandedCategories,
  categoryPriorityList = [],
  unknownCategoryName = 'Uncategorised',
}: DescriptionListProps) => {
  const arrayValues = mapMetaData(valueSet);
  const categoriesMap: Dictionary<ValueListType[]> = groupBy<ValueListType>(
    arrayValues,
    toCategoryWithDefault
  );
  const categories = Object.keys(categoriesMap);

  function getPrioritizedCategoryName() {
    const rest = categories.filter(
      category => !categoryPriorityList.includes(category)
    );
    return [...categoryPriorityList, ...rest];
  }

  function getDefaultActiveKey() {
    return expandedCategories || [getPrioritizedCategoryName()[0]];
  }

  function toCategoryWithDefault({ name }: ValueListType) {
    let category;
    if (toCategory) {
      category = toCategory(name);
    }
    return category || unknownCategoryName;
  }

  const hasMultipleCategories = () => categories.length > 1;

  const renderProperty = (prop: ValueListType) => (
    <Fragment key={prop.key}>
      <dt>{prop.name}</dt>
      <dl>{prop.value}</dl>
    </Fragment>
  );

  const renderValues = (list: ValueListType[]) => {
    return (
      <DL
        style={styles}
        aria-describedby={description ? description.descriptionId : ''}
      >
        {list.map(renderProperty)}
      </DL>
    );
  };

  const renderList = () => {
    return hasMultipleCategories() ? (
      <Collapse defaultActiveKey={getDefaultActiveKey()}>
        {getPrioritizedCategoryName()
          .filter(categoryName => categoriesMap[categoryName])
          .map(categoryName => (
            <Panel key={categoryName} header={categoryName}>
              {renderValues(categoriesMap[categoryName])}
            </Panel>
          ))}
      </Collapse>
    ) : (
      renderValues(arrayValues)
    );
  };

  return (
    <>
      {description && (
        <p id={description.descriptionId}>{description.descriptionText}</p>
      )}
      {arrayValues.length ? renderList() : <NoData>No data</NoData>}
    </>
  );
};

const DL = styled('dl')`
  display: flex;
  flex-wrap: wrap;
  text-align: left;

  dl,
  dt {
    border: 1px solid #e8e8e8;
    border-bottom: unset;
    padding: 16px;
    width: 50%;
    margin: 0;
    background-color: white;
  }

  dl:last-of-type,
  dt:last-of-type {
    border-bottom: 1px solid #e8e8e8;
  }

  dt {
    border-right: unset;
    font-weight: 500;
  }

  @media only screen and (max-width: 840px) {
    dl,
    dt {
      width: 100%;
      border: 1px solid #e8e8e8;
      border-bottom: unset;
    }

    dt {
      background-color: #ececec;
    }

    dt:last-of-type {
      border-bottom: unset;
    }
  }
`;

const NoData = styled('p')`
  border: 1px solid #e8e8e8;
  padding: 16px;
  text-align: center;
`;

const Component = withDefaultTheme(DescriptionList);
Component.displayName = 'DescriptionList';

export { Component as DescriptionList };
