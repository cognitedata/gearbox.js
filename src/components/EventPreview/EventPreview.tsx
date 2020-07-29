// Copyright 2020 Cognite AS
import { CogniteClient, CogniteEvent } from '@cognite/sdk';
import { Spin } from 'antd';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ERROR_API_UNEXPECTED_RESULTS,
  ERROR_NO_SDK_CLIENT,
} from '../../constants/errorMessages';
import { ClientSDKProxyContext } from '../../context/clientSDKProxyContext';
import {
  defaultStrings,
  EventPreviewView,
} from './components/EventPreviewView';
import { EventPreviewProps } from './interfaces';

const LoadingSpinner: React.FC = () => (
  <SpinContainer>
    <Spin />
  </SpinContainer>
);

interface EventPreviewState {
  event: CogniteEvent | null;
}

export class EventPreview extends Component<
  EventPreviewProps,
  EventPreviewState
> {
  static displayName = 'EventPreview';
  static contextType = ClientSDKProxyContext;
  static defaultProps = {
    strings: defaultStrings,
  };
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
    this.client = this.context(EventPreview.displayName || '')!;
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
