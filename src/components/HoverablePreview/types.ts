import React from 'react';

export type TBorders = ['top'?, 'right'?, 'bottom'?, 'left'?];
export type TAlign = 'left' | 'right' | 'center';

export interface HPBasicProps {
  displayOn?: 'hover' | 'click' // when ommited, hoverable preview is always visible and HoverIcon is hidden
}
export interface HPIconProps extends HPBasicProps {
  onMouseOver?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}
export interface HoverablePreviewProps extends HPBasicProps {
  noShadow?: boolean;
  className?: string;
  children: React.ReactNode | string;
}
export interface CellProps {
  children: React.ReactNode | string;
  className?: string;
  title?: string;
  align?: TAlign;
  borders?: TBorders;
}
export interface TAssetsProps {
  className?: string;
  key: string;
  value: string;
}
