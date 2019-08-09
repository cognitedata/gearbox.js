import { Event as ApiEvent, Events } from '@cognite/sdk';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { PureObject } from '../../interfaces';
import {
  EventPreviewStyles,
  EventPreviewView,
} from './components/EventPreviewView';

export type EventPreviewStyles = EventPreviewStyles;

const LoadingSpinner: React.SFC = () => (
  <SpinContainer>
    <Spin />
  </SpinContainer>
);

export interface EventPreviewProps {
  eventId: number;
  onShowDetails?: (e: ApiEvent) => void;
  strings?: PureObject;
  hideProperties?: (keyof ApiEvent)[];
  hideLoadingSpinner?: boolean;
  styles?: EventPreviewStyles;
}

interface EventPreviewState {
  event: ApiEvent | null;
}

export class EventPreview extends React.Component<
  EventPreviewProps,
  EventPreviewState
> {
  isComponentUnmount: boolean = false;

  constructor(props: EventPreviewProps) {
    super(props);
    this.state = {
      event: null,
    };
  }

  componentDidMount() {
    this.loadEvent();
  }

  componentDidUpdate(prevProps: EventPreviewProps) {
    if (prevProps.eventId !== this.props.eventId) {
      this.setState({ event: null });
      this.loadEvent();
    }
  }

  componentWillUnmount() {
    this.isComponentUnmount = true;
  }

  async loadEvent() {
    const event = await Events.retrieve(this.props.eventId);
    if (!this.isComponentUnmount) {
      this.setState({ event });
    }
  }

  render() {
    const {
      hideLoadingSpinner,
      onShowDetails,
      hideProperties,
      strings,
      styles,
    } = this.props;
    const { event } = this.state;
    if (!event) {
      return hideLoadingSpinner ? null : <LoadingSpinner />;
    }

    return (
      <EventPreviewView
        styles={styles}
        event={event}
        onShowDetails={onShowDetails}
        hideProperties={hideProperties}
        strings={strings}
      />
    );
  }
}

const SpinContainer = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  justify-content: center;
`;
