import { ReactNode } from 'react';

export type TBorders = ['top'?, 'right'?, 'bottom'?, 'left'?];
export type TAlign = 'left' | 'right' | 'center';

export interface HPBasicProps {
  className?: string;
}
export interface HoverablePreviewProps extends HPBasicProps {
  noShadow?: boolean;
  children: ReactNode | string;
}
export interface CellProps extends HPBasicProps {
  children: ReactNode | string;
  title?: string;
  align?: TAlign;
  borders?: TBorders;
}
export interface TAssetsProps {
  key: string;
  value: string;
}
