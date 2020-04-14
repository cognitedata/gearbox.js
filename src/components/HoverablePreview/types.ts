import React from 'react';

export type TBorders = ['top'?, 'right'?, 'bottom'?, 'left'?];
export type TAlign = 'left' | 'right' | 'center';

export interface HPIconProps {
  onMouseOver?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}
export interface HPProps {
  displayOn?: 'hover' | 'click' // when ommited, hoverable preview is always visible and HoverIcon is hidden
  noShadow?: boolean;
  fadeIn?: boolean;
  show?: boolean;
  className?: string;
  children: React.ReactNode | string;
}
export interface HPCellProps {
  children: React.ReactNode | string;
  className?: string;
  title?: string;
  align?: TAlign;
  borders?: TBorders;
}

