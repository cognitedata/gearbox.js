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
    if (!this.state.event) {
      return this.props.hideLoadingSpinner ? null : <LoadingSpinner />;
    }

    return (
      <EventPreviewView
        event={this.state.event}
        onShowDetails={this.props.onShowDetails}
        hideProperties={this.props.hideProperties}
        strings={this.props.strings}
      />
    );
  }
}
