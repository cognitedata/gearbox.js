import { Event as ApiEvent, Events } from '@cognite/sdk';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { PureObject } from '../../interfaces';
import { EventPreviewView } from './components/EventPreviewView';

const SpinContainer = styled.div`
  display: flex;
  width: 300px;
  align-items: center;
  justify-content: center;
`;

export const LoadingSpinner: React.SFC = () => (
  <SpinContainer>
    <Spin />
  </SpinContainer>
);

export interface EventPreviewProps {
  eventId: number;
  onShowDetails?: (e: ApiEvent) => void;
  strings?: PureObject;
  hideProperties?: (keyof ApiEvent)[];
  hideDetailsButton?: boolean;
  hideLoadingSpinner?: boolean;
}

interface EventPreviewState {
  event: ApiEvent | null;
}

export class EventPreview extends React.Component<
  EventPreviewProps,
  EventPreviewState
> {
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

  async loadEvent() {
    const event = await Events.retrieve(this.props.eventId);
    this.setState({ event });
  }

  render() {
    if (!this.state.event) {
      return this.props.hideLoadingSpinner ? null : <LoadingSpinner />;
    }

    return (
      <EventPreviewView
        event={this.state.event}
        onShowDetails={this.props.onShowDetails}
        hideProperties={this.props.hideProperties}
        hideDetailsButton={this.props.hideDetailsButton}
        strings={this.props.strings}
      />
    );
  }
}
