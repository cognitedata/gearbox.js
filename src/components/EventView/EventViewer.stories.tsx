import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

import EventPreview from 'components/EventPreview';
import { EVENTS, eventWithout } from 'mocks/events';

const TestCase = styled.div`
  border-bottom: 2px solid #ccc;
  padding-bottom: 16px;
  margin-bottom: 16px;
  h3 {
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
`;

const MonoBold = styled.span`
  font-weight: 700;
  font-family: monospace;
`;

storiesOf('EventPreview', module)
  .add('Base', () => <EventPreview event={EVENTS[0]} />)
  .add('Missing fields', () =>
    Object.keys(EVENTS[0]).map(field => (
      <TestCase key={field}>
        <h3>
          Missing <MonoBold>{field}</MonoBold>
        </h3>
        <EventPreview event={eventWithout(field)} />
      </TestCase>
    ))
  );
