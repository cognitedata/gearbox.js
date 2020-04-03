import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';

const StyledHPHeader = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 20px 15px;

  .close-button {
    margin-left: 5px;
  }
`;

export const HoverablePreviewHeader = (props: any) => (
  <StyledHPHeader>
    <div className="hp-title">{props.title ? props.title : ''}</div>
    <Icon type="close" />
  </StyledHPHeader>
);
