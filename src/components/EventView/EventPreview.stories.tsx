import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

import EventPreview from 'components/EventView/EventPreview';
import { EVENTS, eventWithout } from 'mocks/events';
import { VOnClick } from 'utils/validators';

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

const onShowDetails: VOnClick = (e: SyntheticEvent) => {
  action('onShowDetails')(e);
};

storiesOf('EventPreview', module)
  .add('Base', () => (
    <EventPreview event={EVENTS[0]} onShowDetails={onShowDetails} />
  ))
  .add('Missing fields', () =>
    Object.keys(EVENTS[0]).map(field => (
      <TestCase key={field}>
        <h3>
          Missing <MonoBold>{field}</MonoBold>
        </h3>
        <EventPreview
          event={eventWithout(field)}
          onShowDetails={onShowDetails}
        />
      </TestCase>
    ))
  );
