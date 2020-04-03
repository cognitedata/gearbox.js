import { ReactNode } from 'react';

// container
export type HoverablePreviewProps = {
    title?: string,
    noShadow?: boolean,
    children: ReactNode,
};

export type TAssetsProps = {
    key: string,
    value: string,
}

// cell
export type TBorders = [ 'top'?, 'right'?, 'bottom'?, 'left'? ];
export type TAlign = 'left' | 'right' | 'center';
export type CellProps = {
    title?: string;
    children: ReactNode | string;
    align?: TAlign;
    borders?: TBorders;
};
