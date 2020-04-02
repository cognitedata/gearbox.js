import React, {ReactNode} from 'react';
import styled, { css } from 'styled-components';
import {HoverablePreviewCell} from './components/HoverablePreviewCell';
import {HoverablePreviewHeader} from './components/HoverablePreviewHeader';
// import { HoverablePreviewProps } from './types';

type HoverablePreviewProps = {
    title?: string,
    borders?: boolean,
    children: ReactNode,
};

export const StyledHP = styled.div<HoverablePreviewProps>`
    width: 480px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    color: #111;
    box-shadow: 0px 10px 10px #e8e8e8;
    word-break: break-all;
    ${props => props.borders && css`
        border-top: 1px solid #e8e8e8;
        border-left: 1px solid #e8e8e8;
    `}
`;

export class HoverablePreview extends React.Component<HoverablePreviewProps> {
    static Cell = HoverablePreviewCell;
    static Header = HoverablePreviewHeader;
    render() {
        return (
            <StyledHP>
                {this.props.children}
            </StyledHP>
        )
    };
}
