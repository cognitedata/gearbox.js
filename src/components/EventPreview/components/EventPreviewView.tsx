import { Event as ApiEvent } from '@cognite/sdk';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { PureObject } from '../../../interfaces';
import { formatDatetime } from '../../../utils';
import { ComplexString } from '../../common/ComplexString/ComplexString';

const EventTitle = styled.div`
  font-size: 1.4rem;
  padding-bottom: 16px;
`;
const EventType = styled.div`
  font-size: 1.2rem;
  color: #40a9ff;
  padding-bottom: 8px;
`;
const EventDetailsBlock = styled.div`
  font-size: 1.1rem;
  padding-bottom: 16px;
  p {
    margin: 0;
  }
`;

const Container = styled.div`
  color: rgba(0, 0, 0, 0.45);
  padding: 16px;
  width: 300px;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
  margin-top: 32px;
`;

export const defaultStrings: PureObject = {
  noDescription: 'No description',
  start: 'Start',
  end: 'End',
  details: 'Explore event details',
  metadataSummary: 'Contains {{count}} additional pieces of data',
};

export interface EventPreviewProps {
  event: ApiEvent;
  onShowDetails?: (event: ApiEvent) => void;
  strings?: PureObject;
  hideProperties?: (keyof ApiEvent)[];
}

export const EventPreviewView = ({
  onShowDetails,
  event,
  strings = {},
  hideProperties = [],
}: EventPreviewProps) => {
  const lang = { ...defaultStrings, ...strings };
  const { startTime, endTime, type, subtype, description, metadata } = event;
  const { noDescription, start, end, details, metadataSummary } = lang;
  const startDate = formatDatetime(startTime, 'Unknown');
  const endDate = formatDatetime(endTime, 'Ongoing');
  const metadataCount = metadata ? Object.keys(metadata).length : 0;

  return (
    <Container key="container">
      <EventType>
        {[
          hideProperties.includes('type') ? '' : type,
          hideProperties.includes('subtype') ? '' : subtype,
        ]
          .filter(Boolean)
          .join(' / ')}
      </EventType>
      {!hideProperties.includes('description') && (
        <EventTitle>{description || noDescription}</EventTitle>
      )}
      <EventDetailsBlock>
        {!hideProperties.includes('startTime') && (
          <p>
            {start}: {startDate}
          </p>
        )}
        {!hideProperties.includes('endTime') && (
          <p>
            {end}: {endDate}
          </p>
        )}
      </EventDetailsBlock>
      {!hideProperties.includes('metadata') && (
        <EventDetailsBlock>
          <ComplexString
            input={metadataSummary as string}
            count={metadataCount}
          />
        </EventDetailsBlock>
      )}
      {onShowDetails && (
        <Button
          htmlType="button"
          type="primary"
          onClick={() => onShowDetails(event)}
        >
          {details}
        </Button>
      )}
    </Container>
  );
};
