import { Button, Collapse, Form, Input, Spin } from 'antd';
import { NativeButtonProps } from 'antd/lib/button/button';
import { InputProps } from 'antd/lib/input';
import React, { Component } from 'react';
import styled from 'styled-components';
import { withDefaultTheme } from '../../hoc/withDefaultTheme';
import { AnyIfEmpty, PureObject } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';
import { isEmptyString, sanitizeTenant } from '../../utils/sanitize';

const Panel = Collapse.Panel;

enum TenantValidity {
  CHECKING = 0,
  INVALID = 1,
  UNKNOWN = 2,
}

export interface TenantSelectorStyles {
  button?: React.CSSProperties;
  collapseWrapper?: React.CSSProperties;
  input?: React.CSSProperties;
  subTitle?: React.CSSProperties;
  title?: React.CSSProperties;
  wrapper?: React.CSSProperties;
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
  theme?: AnyIfEmpty<{}>;
}

interface TenantSelectorState {
  tenant: string;
  validity: TenantValidity;
  advanced: PureObject;
}

class TenantSelector extends Component<
  TenantSelectorProps,
  TenantSelectorState
> {
  static defaultProps = {
    advancedOptions: {},
    theme: { ...defaultTheme },
  };

  constructor(props: TenantSelectorProps) {
    super(props);

    const { advancedOptions } = props;

    this.state = {
      tenant: sanitizeTenant(props.initialTenant || ''),
      validity: TenantValidity.UNKNOWN,
      advanced: Object.assign({}, advancedOptions),
    };
  }

  renderAdvancedOptions() {
    const { advanced } = this.state;
    const { styles } = this.props;
    const keys = Object.keys(advanced);

    if (!keys.length) {
      return null;
    }

    const inputs = keys.map(option => {
      return (
        <Form.Item key={option}>
          <StyledInput
            style={styles && styles.input}
            name={option}
            onChange={e => this.onAdvancedOptionChange(e, option)}
            value={advanced[option]}
            placeholder={option}
          />
        </Form.Item>
      );
    });

    return (
      <CollapseWrapper
        bordered={false}
        data-id="collapse-container"
        style={styles && styles.collapseWrapper}
      >
        <Panel key={'0'} header={'Advanced options'}>
          {inputs}
        </Panel>
      </CollapseWrapper>
    );
  }

  render() {
    const {
      header,
      loginText,
      placeholder,
      title,
      unknownMessage,
      styles,
    } = this.props;

    const { tenant, validity } = this.state;

    const checkingValidity = validity === TenantValidity.CHECKING;
    const invalidTenant = validity === TenantValidity.INVALID;

    const formItemProps: {
      validateStatus?: 'error';
      help?: string;
    } = {};

    if (validity === TenantValidity.INVALID) {
      formItemProps.validateStatus = 'error';
      formItemProps.help =
        unknownMessage || 'This is an unknown configuration.';
    }

    return (
      <LoginWrapper style={styles && styles.wrapper}>
        <Title style={styles && styles.title}>{title}</Title>
        {header && typeof header !== 'string' ? (
          header
        ) : (
          <SubTitle style={styles && styles.subTitle}>
            {header || 'Enter your company name'}
          </SubTitle>
        )}
        <Form onSubmit={this.checkTenantValidity}>
          <Form.Item hasFeedback={true} {...formItemProps}>
            <StyledInput
              style={styles && styles.input}
              data-id="tenant-input"
              autoFocus={true}
              onChange={this.onTenantChange}
              value={tenant}
              defaultValue={tenant}
              placeholder={placeholder || 'cognite'}
            />
          </Form.Item>
          {this.renderAdvancedOptions()}
          <LoginButton
            block={true}
            style={styles && styles.button}
            htmlType="submit"
            disabled={checkingValidity || invalidTenant || tenant === ''}
          >
            {checkingValidity ? <Spin size="small" /> : loginText || 'Login'}
          </LoginButton>
        </Form>
      </LoginWrapper>
    );
  }

  private onAdvancedOptionChange(
    e: React.ChangeEvent<HTMLInputElement>,
    option: string
  ) {
    const advanced = Object.assign({}, this.state.advanced);

    advanced[option] = e.target.value;

    this.setState({
      advanced,
      validity: TenantValidity.UNKNOWN,
    });
  }

  private onTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tenant: sanitizeTenant(e.target.value),
      validity: TenantValidity.UNKNOWN,
    });
  };

  private checkTenantValidity = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { onInvalidTenant, onTenantSelected, validateTenant } = this.props;
    const { tenant, advanced } = this.state;
    if (!tenant) {
      return;
    }
    const advancedOptions = Object.keys(advanced).length
      ? this.getNonEmptyAdvancedFields(advanced)
      : null;
    if (tenant.length === 0) {
      this.setState({
        validity: TenantValidity.INVALID,
      });
      if (onInvalidTenant) {
        onInvalidTenant(tenant);
      }
      return;
    }
    this.setState({
      validity: TenantValidity.CHECKING,
    });

    try {
      const isTenantValid = validateTenant
        ? await validateTenant(tenant, advancedOptions)
        : true;

      if (isTenantValid) {
        onTenantSelected(tenant, advancedOptions);
      } else {
        throw new Error('Tenant is invalid');
      }
    } catch (e) {
      this.setState({
        validity: TenantValidity.INVALID,
      });
      if (onInvalidTenant) {
        onInvalidTenant(tenant);
      }
    }
  };

  private getNonEmptyAdvancedFields(advanced: PureObject): PureObject | null {
    const advancedOptions: PureObject = Object.assign({}, advanced);

    Object.keys(advanced).forEach(option => {
      const value = advanced[option];

      if (isEmptyString(value)) {
        delete advancedOptions[option];
      }
    });

    return Object.keys(advancedOptions).length ? advancedOptions : null;
  }
}

const LoginWrapper = styled.div`
  display: flex;
  flex-wrap: initial;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.gearbox.lightShadow};
  background-color: ${({ theme }) => theme.gearbox.containerColor};
  margin: auto;
  padding: 45px;
  overflow: auto;
`;

const Title = styled.h1`
  font-weight: bold;
  color: ${({ theme }) => theme.gearbox.textColor};
`;

const SubTitle = styled.h3`
  color: ${({ theme }) => theme.gearbox.textColor};
`;

const StyledInput = styled((props: InputProps) => <Input {...props} />)`
  && {
    border: none;
    background-color: ${({ theme }) => theme.gearbox.lightGrey};
    font-weight: bold;
    border-radius: 0;
    height: 48px;
    border-bottom: 2px solid ${({ theme }) => theme.gearbox.lightGrey};
    margin-bottom: 8px;
    color: ${({ theme }) => theme.gearbox.textColor};
    &:focus,
    &:active {
      box-shadow: none;
      border-bottom: 2px solid ${({ theme }) => theme.gearbox.primaryColor};
    }
    &:hover {
      border-bottom: 2px solid ${({ theme }) => theme.gearbox.primaryColor};
    }
    &::placeholder {
      color: ${({ theme }) => theme.gearbox.textColorDisabled} !important;
    }
  }
`;

const LoginButton = styled((props: NativeButtonProps) => <Button {...props} />)`
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0;
  min-height: 45px;
  margin: 15px 0;
  border-color: ${({ theme }) => theme.gearbox.buttonBorderColor};

  &:not([disabled]) {
    cursor: pointer;
    background-color: ${({ theme }) => theme.gearbox.primaryColor};
    border-color: ${({ theme }) => theme.gearbox.buttonBorderColor};
    color: ${({ theme }) => theme.gearbox.white};
    &:hover {
      color: ${({ theme }) => theme.gearbox.white};
      border-color: ${({ theme }) => theme.gearbox.primaryColor};
      background-color: ${({ theme }) => theme.gearbox.primaryColor};
    }
  }

  &:disabled,
  &:disabled:hover {
    border-color: ${({ theme }) => theme.gearbox.buttonBorderColor} !important;
    background-color: ${({ theme }) =>
      theme.gearbox.buttonDisabledColor} !important;
    color: ${({ theme }) => theme.gearbox.textColorDisabled};
  }
`;

const CollapseWrapper = styled(Collapse)`
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-content {
    background-color: ${({ theme }) => theme.gearbox.containerColor} !important;
  }
  .ant-collapse-header {
    font-size: 1.17em;
    font-weight: 500;
    color: ${({ theme }) => theme.gearbox.textColor} !important;
    padding-left: 20px !important;
    background-color: ${({ theme }) => theme.gearbox.containerColor};

    .ant-collapse-arrow {
      left: 0 !important;
      color: ${({ theme }) => theme.gearbox.textColor} !important;
    }
  }
  .ant-collapse-content-box {
    padding: 5px 0 0 0 !important;
  }
`;

const TenantSelectorWithTheme = withDefaultTheme(TenantSelector);
TenantSelectorWithTheme.displayName = 'TenantSelector';

export { TenantSelectorWithTheme as TenantSelector };
export { TenantSelector as TenantSelectorWithoutTheme };
