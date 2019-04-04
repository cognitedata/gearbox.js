import { Button, Form, Input, Spin, Collapse } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { sanitizeTenant, isEmptyString } from 'sanitize';
import { VPureObject } from 'utils/validators';

const Panel = Collapse.Panel;

enum TenantValidity {
  CHECKING = 0,
  INVALID = 1,
  UNKNOWN = 2,
}

/**
 * Check the validity of a given tenant name. If this returns {@code true} or
 * resolves, then the tenant is valid. If it throws an error or returns
 * {@code false} then the tenant is invalid.
 */
export type OnTenantValidationFunction = (
  tenant: string,
  advancedOptions: VPureObject | null
) => Promise<boolean>;

export type OnInvalidTenantFunction = (tenant: string) => void;

export type OnTenantSelectionFunction = (
  tenant: string,
  advancedOptions: VPureObject | null
) => void;

export interface TenantSelectorProps {
  header?: string | React.ReactNode;
  initialTenant?: string;
  loginText?: string;
  onInvalidTenant?: OnInvalidTenantFunction | any;
  onTenantSelected: OnTenantSelectionFunction | any;
  placeholder?: string;
  title: string | React.ReactNode;
  unknownMessage?: string;
  validateTenant: OnTenantValidationFunction | any;
  advancedOptions?: VPureObject;
}

interface TenantSelectorState {
  tenant: string;
  validity: TenantValidity;
  advanced: VPureObject;
}

class TenantSelector extends React.Component<
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
    const keys = Object.keys(advanced);

    if (!keys.length) {
      return null;
    }

    const inputs = Object.keys(advanced).map(option => {
      return (
        <Form.Item key={option}>
          <Input
            name={option}
            onChange={e => this.onAdvancedOptionChange(e, option)}
            value={advanced[option]}
            placeholder={option}
          />
        </Form.Item>
      );
    });

    return (
      <CollapseWrapper bordered={false} data-id="collapse-container">
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
      <LoginWrapper>
        <Title>{title}</Title>
        {header || <h3>Enter your company name</h3>}
        <Form>
          <Form.Item hasFeedback={true} {...formItemProps}>
            <Input
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
        <Button
          htmlType="button"
          disabled={checkingValidity || invalidTenant || tenant === ''}
          onClick={this.checkTenantValidity}
          className="uppercase tenant-selector-login-button"
        >
          {checkingValidity ? <Spin size="small" /> : loginText || 'Login'}
        </Button>
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

  private checkTenantValidity = () => {
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
    validateTenant(tenant, advancedOptions)
      .then(() => {
        onTenantSelected(tenant, advancedOptions);
      })
      .catch(() => {
        this.setState({
          validity: TenantValidity.INVALID,
        });
        if (onInvalidTenant) {
          onInvalidTenant(tenant);
        }
      });
  };

  private getNonEmptyAdvancedFields(advanced: VPureObject): VPureObject | null {
    const advancedOptions: VPureObject = Object.assign({}, advanced);

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
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 1px 6px 20px 8px,
    rgba(0, 0, 0, 0.11) 0px 6px 6px;
  background-color: rgb(255, 255, 255);
  margin: auto;
  padding: 45px;
  overflow: auto;

  .tenant-selector-login-button {
    font-weight: bold;
    a {
      color: #000000;
    }
    border-radius: 0;
    min-height: 45px;
    margin: 15px 0;

    &:not([disabled]) {
      cursor: pointer;
      background-color: #179aff;
      color: #fff;
    }
  }

  input {
    border: none;
    background-color: #f5f5f5;
    font-weight: bold;
    border-radius: 0;
    height: 48px;
    border-bottom: 2px solid #f5f5f5;
    margin-bottom: 8px;

    &:focus,
    &:active {
      box-shadow: none;
      border-bottom: 2px solid #179aff;
    }
  }
`;

const Title = styled.h1`
  font-weight: bold;
`;

const CollapseWrapper = styled(Collapse)`
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-header {
    font-size: 1.17em;
    font-weight: 500;
    padding-left: 20px !important;

    .ant-collapse-arrow {
      left: 0 !important;
    }
  }
  .ant-collapse-content-box {
    padding: 5px 0 0 0 !important;
  }
`;

export default TenantSelector;
