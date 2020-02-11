import { Checkbox } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import { withDefaultTheme } from '../../../hoc';
import { AnyIfEmpty } from '../../../interfaces';

export interface DetailCheckboxProps {
  checked: boolean;
  description: string;
  disabled: boolean;
  onContainerClick: any;
  onContainerMouseOver?: any;
  title: string;
  className: string;
  checkable: boolean;
  theme?: AnyIfEmpty<{}>;
}

const DetailCheckbox: FC<DetailCheckboxProps> = ({
  checked = false,
  description,
  disabled = false,
  onContainerClick = null,
  onContainerMouseOver,
  title,
  className = 'detail-checkbox',
  checkable = true,
}) => (
  <Container
    className={className}
    onClick={disabled ? null : onContainerClick}
    onMouseOver={onContainerMouseOver}
  >
    <div style={{ wordBreak: 'break-all' }}>
      <span
        style={{
          fontSize: '14px',
        }}
      >
        {title}
      </span>
      <br />
      <span
        style={{
          fontSize: '12px',
          opacity: 0.6,
        }}
      >
        {description}
      </span>
    </div>
    {checkable && (
      <Checkbox
        checked={checked}
        disabled={disabled}
        onClick={e => e.preventDefault()}
      />
    )}
  </Container>
);

const Container = styled.div`
  background: white;
  border: 'none';
  border-radius: 3px;
  display: inline-flex;
  justify-content: space-between;
  padding: 8px;
  margin-right: 'inherit';
  cursor: pointer;
  margin-bottom: 4px;
  width: 100%;
  transition: 0.3s all;

  &.active {
    background-color: ${({ theme }) => theme.gearbox.selectColor};
  }

  label {
    margin: auto 16px auto 32px;
  }
`;

const Component = withDefaultTheme(DetailCheckbox);
Component.displayName = 'DetailCheckbox';

export { Component as DetailCheckbox };
