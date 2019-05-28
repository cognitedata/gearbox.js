import { Button, Collapse, Form, Input as AntInput, Spin } from 'antd';
import { NativeButtonProps } from 'antd/lib/button/button';
import { InputProps } from 'antd/lib/input';
import React from 'react';
import styled from 'styled-components';
import { PureObject } from '../../interfaces';
import { defaultTheme } from '../../theme/defaultTheme';
import { isEmptyString, sanitizeTenant } from '../../utils';

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
  header?: string | React.ReactNode;
  initialTenant?: string;
  loginText?: string;
  onInvalidTenant?: (tenant: string) => void;
  onTenantSelected: (
    tenant: string,
    advancedOptions: PureObject | null
  ) => void;
  placeholder?: string;
  title: string | React.ReactNode;
  unknownMessage?: string;
  validateTenant?: (
    tenant: string,
    advancedOptions: PureObject | null
  ) => Promise<boolean>;
  advancedOptions?: PureObject;
  styles?: TenantSelectorStyles;
}

interface TenantSelectorState {
  tenant: string;
  validity: TenantValidity;
  advanced: PureObject;
}

export class TenantSelector extends React.Component<
  TenantSelectorProps,
  TenantSelectorState
> {
  static defaultProps = {
    advancedOptions: {},
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
          <Input
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
        <Form>
          <Form.Item hasFeedback={true} {...formItemProps}>
            <Input
              style={styles && styles.input}
              data-id="tenant-input"
              autoFocus={true}
              onChange={this.onTenantChange}
              onPressEnter={this.checkTenantValidity}
              value={tenant}
              defaultValue={tenant}
              placeholder={placeholder || 'cognite'}
            />
          </Form.Item>
          {this.renderAdvancedOptions()}
        </Form>
        <LoginButton
          style={styles && styles.button}
          htmlType="button"
          disabled={checkingValidity || invalidTenant || tenant === ''}
          onClick={this.checkTenantValidity}
        >
          {checkingValidity ? <Spin size="small" /> : loginText || 'Login'}
        </LoginButton>
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
    });
  }

  private onTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tenant: sanitizeTenant(e.target.value),
      validity: TenantValidity.UNKNOWN,
    });
  };

  private checkTenantValidity = async () => {
    const { onInvalidTenant, onTenantSelected, validateTenant } = this.props;
    const { tenant, advanced } = this.state;

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

LoginWrapper.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const Title = styled.h1`
  font-weight: bold;
  color: ${({ theme }) => theme.gearbox.textColor};
`;

Title.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const SubTitle = styled.h3`
  color: ${({ theme }) => theme.gearbox.textColor};
`;

SubTitle.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const Input = styled((props: InputProps) => <AntInput {...props} />)`
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
      color: ${props => props.theme.gearbox.textColorDisabled} !important;
    }
  }
`;

Input.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

const LoginButton = styled((props: NativeButtonProps) => <Button {...props} />)`
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0;
  min-height: 45px;
  margin: 15px 0;
  border-color: ${props => props.theme.gearbox.buttonBorderColor};

  &:not([disabled]) {
    cursor: pointer;
    background-color: ${props => props.theme.gearbox.primaryColor};
    border-color: ${props => props.theme.gearbox.buttonBorderColor};
    color: ${props => props.theme.gearbox.white};
    &:hover {
      color: ${props => props.theme.gearbox.white};
      border-color: ${props => props.theme.gearbox.primaryColor};
      background-color: ${({ theme }) => theme.gearbox.primaryColor};
    }
  }

  &:disabled,
  &:disabled:hover {
    border-color: ${props => props.theme.gearbox.buttonBorderColor} !important;
    background-color: ${props =>
      props.theme.gearbox.buttonDisabledColor} !important;
    color: ${props => props.theme.gearbox.textColorDisabled};
  }
`;

LoginButton.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};

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

CollapseWrapper.defaultProps = {
  theme: {
    gearbox: defaultTheme,
  },
};
