import React from 'react';
import styled from 'styled-components';
import { ValueListType } from '../../interfaces';
import { mapMetaData } from '../../utils/formatters';

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

export interface DescriptionListProps {
  description?: {
    descriptionId: string;
    descriptionText: string;
  };
  valueSet: { [name: string]: any };
  styles?: React.CSSProperties;
}

export const DescriptionList = (props: DescriptionListProps) => {
  const { description, valueSet } = props;

  const arrayValues = mapMetaData(valueSet);

  return (
    <>
      {description && (
        <p id={description.descriptionId}>{description.descriptionText}</p>
      )}
      {arrayValues.length >= 1 ? (
        <DL
          style={props.styles}
          aria-describedby={description ? description.descriptionId : ''}
        >
          {arrayValues.map((valSet: ValueListType) => (
            <React.Fragment key={valSet.key}>
              <dt>{valSet.name}</dt>
              <dl>{valSet.value}</dl>
            </React.Fragment>
          ))}
        </DL>
      ) : (
        <NoData>No data</NoData>
      )}
    </>
  );
};

DescriptionList.displayName = 'DescriptionList';
