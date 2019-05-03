import { Event as ApiEvent, Events } from '@cognite/sdk';
import React from 'react';
import { OnClick, PureObject } from '../../interfaces';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { EventPreviewView } from './components/EventPreviewView';
export interface EventPreviewProps {
  eventId: number;
  onShowDetails: OnClick;
  strings?: PureObject;
}

interface EventPreviewState {
  event: ApiEvent | null;
  isLoading: boolean;
}

export class EventPreview extends React.Component<
  EventPreviewProps,
  EventPreviewState
> {
  constructor(props: EventPreviewProps) {
    super(props);
    this.state = {
      event: null,
      isLoading: true,
    };
  }

  async componentDidMount() {
    const event = await Events.retrieve(this.props.eventId);
    this.setState({ event, isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingSpinner />;
    }

    if (this.state.event) {
      return (
        <EventPreviewView
          event={this.state.event}
          onShowDetails={this.props.onShowDetails}
          strings={this.props.strings}
        />
      );
    } else {
      console.log('--------?????');
      return null;
    }
  }
}
