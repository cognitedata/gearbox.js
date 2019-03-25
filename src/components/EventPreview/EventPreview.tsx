// @ts-ignore
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { formatDatetime } from 'utils/formatters';
import { VApiEvent, VMetadata, VOnClick } from 'utils/validators';
import { ComplexString } from 'utils/helpers';

const EventTitle = styled.div`
  font-size: 1.4rem;
  padding-bottom: 16px;
`;
const EventType = styled.div`
  font-size: 1.2rem;
  color: #40a9ff;
  padding-bottom: 8px;
`;
const EventDescription = styled.div`
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

export const defaultStrings: VMetadata = {
  noDescription: 'No description',
  start: 'Start',
  end: 'End',
  details: 'Explore event details',
  metadataSummary: 'Contains {{count}} additional pieces of data',
};

export interface EventPreviewProps {
  event: VApiEvent;
  onShowDetails: VOnClick;
  strings?: VMetadata;
}

const EventPreview = ({
  onShowDetails,
  event,
  strings = {},
}: EventPreviewProps) => {
  const lang = { ...defaultStrings, ...strings };
  const { startTime, endTime, type, subtype, description, metadata } = event;
  const { noDescription, start, end, details, metadataSummary } = lang;
  const startDate = formatDatetime(startTime, 'Unknown');
  const endDate = formatDatetime(endTime, 'Ongoing');
  const metadataCount = metadata ? Object.keys(metadata).length : 0;

  return (
    <Container key="container">
      <EventType>{[type, subtype].filter(Boolean).join(' / ')}</EventType>
      <EventTitle>{description || noDescription}</EventTitle>
      <EventDescription>
        <p>
          {start}: {startDate}
        </p>
        <p>
          {end}: {endDate}
        </p>
      </EventDescription>
      <EventDescription>
        <ComplexString input={metadataSummary} count={metadataCount} />
      </EventDescription>
      <Button htmlType="button" type="primary" onClick={onShowDetails}>
        {details}
      </Button>
    </Container>
  );
};
EventPreview.displayName = 'EventPreview';

export default EventPreview;
