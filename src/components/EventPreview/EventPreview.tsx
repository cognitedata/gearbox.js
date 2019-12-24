import { CogniteEvent } from '@cognite/sdk';
import { Spin } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKContext } from '../../context/clientSDKContext';
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
  /**
   * Event Id
   */
  eventId: number;
  /**
   * Function triggered when user clicks on the 'Explore event details' button. If the function is not provided the button will not be rendered.
   */
  onShowDetails?: (e: CogniteEvent) => void;
  /**
   * Object map with strings to customize/localize text in the component
   */
  strings?: PureObject;
  /**
   * List of event properties to be hidden
   */
  hideProperties?: (keyof CogniteEvent)[];
  /**
   * Defines whether to hide the loading spinner
   */
  hideLoadingSpinner?: boolean;
  /**
   * Object that defines inline CSS styles for inner elements of the component.
   */
  styles?: EventPreviewStyles;
}

interface EventPreviewState {
  event: CogniteEvent | null;
}

export class EventPreview extends Component<
  EventPreviewProps,
  EventPreviewState
> {
  static contextType = ClientSDKContext;
  context!: React.ContextType<typeof ClientSDKContext>;

  isComponentUnmount: boolean = false;

  constructor(props: EventPreviewProps) {
    super(props);
    this.state = {
      event: null,
    };
  }

  componentDidMount() {
    if (!this.context) {
      console.error(ERROR_NO_SDK_CLIENT);
      return;
    }
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
    const events = await this.context!.events.retrieve([
      { id: this.props.eventId },
    ]);
    if (events.length !== 1) {
      console.error(ERROR_API_UNEXPECTED_RESULTS);
      return;
    }

    if (!this.isComponentUnmount) {
      this.setState({ event: events[0] });
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
