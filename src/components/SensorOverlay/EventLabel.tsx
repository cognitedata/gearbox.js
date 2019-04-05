import React, { Component } from 'react';
import styled from 'styled-components';
import { SensorOverlayClickHandler } from 'utils/validators/SensorOverlayTypes';

const TagContainer = styled.div<{
  left: number;
  top: number;
  flipped: boolean;
  z: number;
}>`
  position: absolute;
  transform: translate3d(${({ left }) => left}px, ${({ top }) => top}px, 0)
    rotate(${({ flipped }) => (flipped ? '180' : '0')}deg);
  transform-origin: 24px 50%;
  z-index: ${({ z }) => z};
`;

const Tag = styled.div`
  background: ${props => props.color};
  border-radius: 30px;
  color: white;
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  padding: 6px 4px;
  transition: 0.3s all;
  transform-origin: 24px 50%;
  @media screen and (max-width: 1000px) {
    transform: scale(0.75);
  }
`;

const TagValue = styled.div<{ flipped: boolean }>`
  font-size: 1.4rem;
  padding: 4px 0;
  display: flex;
  position: relative;
  top: 1px;
  ${({ flipped }) => (flipped ? 'transform: rotate(180deg);' : '')}
`;

interface EventLabelProps {
  flipped: boolean;
  description: string;
  nodeId: number;
  left: number;
  top: number;
  color: string;
  onClick?: SensorOverlayClickHandler;
  zIndex?: number;
}

interface EventLabelState {
  hovering: boolean;
}

class EventLabel extends Component<EventLabelProps, EventLabelState> {
  static defaultProps: Partial<EventLabelProps> = {
    color: '',
    flipped: false,
  };

  constructor(props: EventLabelProps) {
    super(props);
    this.state = {
      hovering: false,
    };
  }

  render() {
    const { left, top, color, flipped, zIndex, description } = this.props;
    const { hovering } = this.state;
    const z = hovering ? 100 : zIndex ? zIndex : 0;

    return (
      <TagContainer left={left} top={top} flipped={flipped} z={z}>
        <Tag
          color={color}
          onClick={this.onMouseClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        >
          <TagValue flipped={this.props.flipped}>{description}</TagValue>
        </Tag>
      </TagContainer>
    );
  }

  private onMouseOver = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.setState({
      hovering: true,
    });
  };

  private onMouseLeave = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.setState({
      hovering: false,
    });
  };

  private onMouseClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.nodeId);
    }
  };
}

export default EventLabel;
