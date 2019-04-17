import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';

const Container = styled.div`
  background: white;
  border: 'none';
  display: inline-flex;
  justify-content: space-between;
  padding: 8px;
  margin-right: 'inherit';
  cursor: pointer;
  margin-bottom: 4px;
  width: 100%;
`;

export interface DetailCheckboxProps {
  checked: boolean;
  description: string;
  disabled: boolean;
  onContainerClick: any;
  title: string;
  className: string;
  checkable: boolean;
}

const defaultProps = {
  checkable: true,
  onContainerClick: null,
  disabled: false,
  checked: false,
  className: 'detail-checkbox',
};

export const DetailCheckbox: React.SFC<DetailCheckboxProps> = ({
  checked,
  description,
  disabled,
  onContainerClick,
  title,
  className,
  checkable,
}) => (
  <Container className={className} onClick={disabled ? null : onContainerClick}>
    <div style={{ wordBreak: 'break-all' }}>
      <p
        style={{
          fontSize: '14px',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: '12px',
          opacity: 0.6,
        }}
      >
        {description}
      </p>
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

DetailCheckbox.defaultProps = defaultProps;
