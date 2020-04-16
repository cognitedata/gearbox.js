import React from 'react';

export type TBorders = ('top' | 'right' | 'bottom' | 'left')[];
export type TAlign = 'left' | 'right' | 'center';

interface HPBasic {
  className?: string;
}

export interface HPIconProps extends HPBasic {
  onMouseOver?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}
export interface HPProps extends HPBasic {
  displayOn?: 'hover' | 'click' // when ommited, hoverable preview is always visible and HoverIcon is hidden
  noShadow?: boolean;
  fadeIn?: boolean;
  show?: boolean;
  children: React.ReactNode | string;
}
export interface HPCellProps extends HPBasic {
  children: React.ReactNode | string;
  title?: string;
  align?: TAlign;
  borders?: TBorders;
}

