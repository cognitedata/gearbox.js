import React from 'react';
import styled, { css } from 'styled-components';
import { HPCellProps, TBorders } from '../../types';

const adjustBorders = (borders?: TBorders) => {
  const top = borders && borders.includes('top') ? 'solid' : 'none';
  const right = borders && borders.includes('right') ? 'solid' : 'none';
  const bottom = borders && borders.includes('bottom') ? 'solid' : 'none';
  const left = borders && borders.includes('left') ? 'solid' : 'none';

  return css`
    border: 1px solid #d9d9d9;
    border-style: ${top} ${right} ${bottom} ${left};
  `;
};

const StyledHPCell = styled.div<HPCellProps>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  color: #262626;
  font-size: 14px;
  line-height: 24px;
  width: ${({ align }) => (align ? '50%' : '100%')};
  ${({ align }) =>
    align === 'right' &&
    css`
      margin-left: auto;
    `}
  ${({ borders }) => borders && adjustBorders(borders)}

    .title {
    text-transform: uppercase;
    color: #595959;
    font-size: 12px;
    line-height: 20px;
  }
`;

export class HoverablePreviewCell extends React.Component<HPCellProps, {loaded: boolean}> {
  render() {
    const { title, children, borders, align } = this.props;

    return (
        <StyledHPCell className="hp-cell" borders={borders} align={align}>
          {title && <div className="hp-cell-title">{title}</div>}
          {children}
        </StyledHPCell>
    );
  }
}
