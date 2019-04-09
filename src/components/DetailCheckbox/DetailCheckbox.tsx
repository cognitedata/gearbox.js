import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';

const Container = styled.div`
  background: white;
  border-radius: 3px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: inline-flex;
  justify-content: space-between;
  padding: 16px;
  margin-right: 'inherit';
  cursor: pointer;
  margin-bottom: 16px;
  transition: 0.3s all;

  label {
    margin: auto 16px auto 32px;
  }
`;

const Title = styled.div`
  font-size: 18px;
`;

const Description = styled.div`
  font-size: 14px;
`;

export interface DetailCheckboxProps {
  checked: boolean;
  description: string;
  disabled: boolean;
  onContainerClick: any;
  title: string;
  className: string;
}

const defaultProps = {
  onContainerClick: null,
  disabled: false,
  checked: false,
  className: 'detail-checkbox',
};

const DetailCheckbox: React.SFC<DetailCheckboxProps> = ({
  checked,
  description,
  disabled,
  onContainerClick,
  title,
  className,
}) => (
  <Container
    className={className}
    onClick={disabled ? null : onContainerClick}
    style={{
      borderColor: `${checked ? '#1890ff' : 'rgba(0, 0, 0, 0.2)'}`,
      width: '100%',
      border: 'none',
      padding: '8px',
      marginBottom: '4px',
    }}
  >
    <div style={{ wordBreak: 'break-all' }}>
      <Title
        style={{
          fontSize: '14px',
        }}
      >
        {title}
      </Title>
      <Description
        style={{
          fontSize: '12px',
          opacity: 0.6,
        }}
      >
        {description}
      </Description>
    </div>
    <Checkbox
      checked={checked}
      disabled={disabled}
      onClick={e => e.preventDefault()}
    />
  </Container>
);

DetailCheckbox.defaultProps = defaultProps;

export default DetailCheckbox;
