import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
  
type CellProps = {
    title?: string;
    children: ReactNode | string;
    align?: 'left' | 'right';
    borders?: boolean;
};

const adjustBorders = (align?:string) => {
    if (!align) // centered
        return (css`
            border: 2px solid #e8e8e8;
            border-style: none none solid none;
        `);
    if (align === 'left')
        return (css`
            border: 2px solid #e8e8e8;
            border-style: none solid solid none;
        `);
    if (align === 'right')
        return (css`
            border: 2px solid #e8e8e8;
            border-style: none none solid solid;
        `);
}

const translateAlign = (align?:string) => {
    switch (align) {
        case 'left': return 'start';
        case 'right': return 'end';
        default: return 'center';
    }
}

const StyledHPCell = styled.div<CellProps>`
    display: flex;
    flex-direction: column;
    align-self: ${props => translateAlign(props.align)};
    padding: 15px;
    width: ${props => props.align ? '50%' : '100%'};
    box-sizing: border-box;
    ${props => props.borders && adjustBorders(props.align)}

    .title {
        text-transform: uppercase;
        font-size: 0.8em;

    }
`;

export class HoverablePreviewCell extends React.Component<CellProps> {
    constructor(props:CellProps) {
        super(props);
    }

    render() {
        const { title, children, borders, align } = this.props;
        return (
            <StyledHPCell borders={borders} align={align}>
                {title && <div className="title">{title}</div>}
                {children}
            </StyledHPCell>
        )
    };
};
