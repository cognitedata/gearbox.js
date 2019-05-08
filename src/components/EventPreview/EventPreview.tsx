import { Event as ApiEvent, Events } from '@cognite/sdk';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { PureObject } from '../../interfaces';
import { PromiseKeeper } from '../../utils';
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
  loadEventCancel: (() => void) | null = null;

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
    if (this.loadEventCancel) {
      this.loadEventCancel();
    }
  }

  async loadEvent() {
    if (this.loadEventCancel) {
      this.loadEventCancel();
    }
    const { promise, cancel } = PromiseKeeper.cancelable(
      Events.retrieve(this.props.eventId)
    );

    this.loadEventCancel = cancel;

    try {
      const event = await promise;
      this.loadEventCancel = null;

      this.setState({ event });
    } catch (e) {
      if (e.isCanceled) {
        this.loadEventCancel = null;
      }
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
