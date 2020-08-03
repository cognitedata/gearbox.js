// Copyright 2020 Cognite AS
import { CogniteEvent } from '@cognite/sdk';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { withDefaultTheme } from '../../../hoc';
import { PureObject, Theme } from '../../../interfaces';
import { formatDatetime } from '../../../utils/formatters';
import { applyThemeFontFamily } from '../../../utils/theme';
import { ComplexString } from '../../common/ComplexString/ComplexString';
import { EventPreviewStyles } from '../interfaces';

export const defaultStrings: PureObject = {
  noDescription: 'No description',
  start: 'Start',
  end: 'End',
  noStartTime: 'Unknown',
  noEndTime: 'Ongoing',
  details: 'Explore event details',
  metadataSummary: 'Contains {{count}} additional pieces of data',
};

interface EventPreviewViewProps {
  event: CogniteEvent;
  onShowDetails?: (event: CogniteEvent) => void;
  strings?: PureObject;
  hideProperties?: (keyof CogniteEvent)[];
  styles?: EventPreviewStyles;
  theme?: Theme;
}

const EventPreviewView = ({
  onShowDetails,
  event,
  strings = {},
  hideProperties = [],
  styles = {},
}: EventPreviewViewProps) => {
  const lang = { ...defaultStrings, ...strings };
  const { startTime, endTime, description, metadata, type, subtype } = event;
  const {
    noDescription,
    start,
    end,
    details,
    metadataSummary,
    noStartTime,
    noEndTime,
  } = lang;
  const startDate = formatDatetime(startTime, noStartTime as string);
  const endDate = formatDatetime(endTime, noEndTime as string);
  const metadataCount = metadata ? Object.keys(metadata).length : 0;

  return (
    <Container key="container" style={styles.wrapper}>
      <EventType style={styles.eventType}>
        {[
          hideProperties.includes('type') ? '' : type,
          hideProperties.includes('subtype') ? '' : subtype,
        ]
          .filter(Boolean)
          .join(' / ')}
      </EventType>
      {!hideProperties.includes('description') && (
        <EventTitle style={styles.description}>
          {description || noDescription}
        </EventTitle>
      )}
      <EventDetailsBlock style={styles.times}>
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
        <EventDetailsBlock style={styles.metadata}>
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
          style={styles.button}
        >
          {details}
        </Button>
      )}
    </Container>
  );
};

const EventTitle = styled.div`
  font-size: 1.4rem;
  padding-bottom: 16px;
`;
const EventType = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.gearbox.textColorAccent};
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
  color: ${({ theme }) => theme.gearbox.textColorSecondary};
  padding: 16px;
  width: 300px;
  background-color: ${({ theme }) => theme.gearbox.containerColor};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.gearbox.containerBorderColor};
  margin-top: 32px;
  ${({ theme }) => applyThemeFontFamily(theme.gearbox)};
`;

const Component = withDefaultTheme(EventPreviewView);
Component.displayName = 'EventPreviewView';

export { Component as EventPreviewView };
