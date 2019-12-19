import { CogniteClient, CogniteEvent } from '@cognite/sdk';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import { PureObject } from '../../interfaces';
import {
  EventPreviewStyles as Styles,
  EventPreviewView,
} from './components/EventPreviewView';

export type EventPreviewStyles = Styles;

const LoadingSpinner: React.FC = () => (
  <SpinContainer>
    <Spin />
  </SpinContainer>
);

export interface EventPreviewProps {
  eventId: number;
  onShowDetails?: (e: CogniteEvent) => void;
  strings?: PureObject;
  hideProperties?: (keyof CogniteEvent)[];
  hideLoadingSpinner?: boolean;
  styles?: EventPreviewStyles;
}

interface EventPreviewState {
  event: CogniteEvent | null;
}

export class EventPreview extends React.Component<
  EventPreviewProps,
  EventPreviewState
> {
  static contextType = ClientSDKProxyContext;
  context!: React.ContextType<typeof ClientSDKProxyContext>;
  client!: CogniteClient;

  isComponentUnmount: boolean = false;

  constructor(props: EventPreviewProps) {
    super(props);
    this.state = {
      event: null,
    };
  }

  componentDidMount() {
    this.client = this.context('EventPreview')!;
    if (!this.client) {
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
    const events = await this.client.events.retrieve([
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
