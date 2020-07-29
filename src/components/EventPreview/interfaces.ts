// Copyright 2020 Cognite AS
import { CogniteEvent } from '@cognite/sdk';
import { CSSProperties } from 'react';
import { PureObject } from '../../interfaces';

export interface EventPreviewStyles {
  wrapper?: CSSProperties;
  eventType?: CSSProperties;
  description?: CSSProperties;
  button?: CSSProperties;
  times?: CSSProperties;
  metadata?: CSSProperties;
}

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
