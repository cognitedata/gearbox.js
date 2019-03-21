// @ts-ignore
import { Button } from 'antd';
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { formatDatetime } from 'utils/formatters';
import { VApiEvent, VOnClick } from 'utils/validators';

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

export interface EventPreviewProps {
  event: VApiEvent;
  onShowDetails: VOnClick;
}

const EventPreview = (props: EventPreviewProps) => {
  const {
    onShowDetails,
    event: { startTime, endTime, type, subtype, description, metadata = {} },
  } = props;
  const startDate = formatDatetime(startTime, 'Unknown');
  const endDate = formatDatetime(endTime, 'Ongoing');
  const metadataCount = Object.keys(metadata).length;

  return (
    <Container key="container">
      <EventType>{[type, subtype].filter(Boolean).join(' / ')}</EventType>
      <EventTitle>
        {description || <Trans i18nKey="noDescription">No description</Trans>}
      </EventTitle>
      <EventDescription>
        <Trans i18nKey="start">Start: {startDate}</Trans>
        <br />
        <Trans i18nKey="end">End: {endDate}</Trans>
      </EventDescription>
      <EventDescription>
        <Trans i18nKey="metadataSummary" count={metadataCount}>
          Contains {metadataCount} additional pieces of data
        </Trans>
      </EventDescription>
      <Button type="primary" onClick={onShowDetails}>
        <Trans i18nKey="details">Explore event details</Trans>
      </Button>
    </Container>
  );
};

export default EventPreview;
