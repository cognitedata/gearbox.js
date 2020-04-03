import { ReactNode } from 'react';

// container
export interface HoverablePreviewProps {
  title?: string;
  noShadow?: boolean;
  children: ReactNode;
}

export interface TAssetsProps {
  key: string;
  value: string;
}

// cell
export type TBorders = ['top'?, 'right'?, 'bottom'?, 'left'?];
export type TAlign = 'left' | 'right' | 'center';
export interface CellProps {
  title?: string;
  children: ReactNode | string;
  align?: TAlign;
  borders?: TBorders;
}
