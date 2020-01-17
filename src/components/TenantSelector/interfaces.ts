import React, { CSSProperties } from 'react';
import { AnyIfEmpty, PureObject } from '../../interfaces';

export interface TenantSelectorStyles {
  button?: CSSProperties;
  collapseWrapper?: CSSProperties;
  input?: CSSProperties;
  subTitle?: CSSProperties;
  title?: CSSProperties;
  wrapper?: CSSProperties;
}

export interface TenantSelectorProps {
  /**
   * A title text
   */
  title: string | React.ReactNode;
  /**
   * A function called when the button is clicked
   */
  onTenantSelected: (
    tenant: string,
    advancedOptions: PureObject | null
  ) => void;
  /**
   * Text to show as header
   */
  header?: string | React.ReactNode;
  /**
   * Initial value of the input field
   */
  initialTenant?: string;
  /**
   * Text to show on the button
   */
  loginText?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Message to show if validation fails
   */
  unknownMessage?: string;
  /**
   * function called when tenant is invalid
   */
  onInvalidTenant?: (tenant: string) => void;
  /**
   * Asyncronous function to validate the input
   */
  validateTenant?: (
    tenant: string,
    advancedOptions: PureObject | null
  ) => Promise<boolean>;
  /**
   * Object to show as advanced options
   */
  advancedOptions?: PureObject;
  /**
   * Object that defines inline CSS styles for inner elements of the component.
   */
  styles?: TenantSelectorStyles;
  /**
   * @ignore
   */
  theme?: AnyIfEmpty<{}>;
}
