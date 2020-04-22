import React from 'react';

type TBorderType = 'top' | 'right' | 'bottom' | 'left';
export type TBorders = TBorderType[];
export type TAlign = 'left' | 'right' | 'center';

interface HPBasic {
  className?: string;
}

export interface HPIconProps extends HPBasic {
  ref?: any;
  onMouseOver?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
  icon?: string;
}
export interface HPHeader {
  children?: React.ReactNode;
  underline?: boolean;
}
export interface HPProps extends HPBasic {
  displayOn?: 'hover' | 'click'; // when ommited, hoverable preview is always visible and HoverIcon is hidden
  noShadow?: boolean;
  fadeIn?: boolean;
  show?: boolean;
  icon?: string;
  children: React.ReactNode | string;
}
export interface HPCellProps extends HPBasic {
  children: React.ReactNode | string;
  title?: string;
  align?: TAlign;
  borders?: TBorders;
}
