import React, { Component } from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import Odometer from 'react-odometerjs';
import StyledOdometer from './StyledOdometer';
import { VMetadata } from 'utils/validators';
import {
  Timeseries,
  SensorOverlayClickHandler,
  LinkType,
} from 'utils/validators/SensorOverlayTypes';

const HELLIP = String.fromCharCode(0x02026);

const SensorTagContainer = styled.div<{
  left: number;
  top: number;
  flipped: boolean;
  z: number;
}>`
  position: absolute;
  pointer-events: auto;
  transform: translate3d(${({ left }) => left}px, ${({ top }) => top}px, 0)
    rotate(${({ flipped }) => (flipped ? '180' : '0')}deg);
  transform-origin: 24px 50%;
  z-index: ${({ z }) => z};
`;

export const Tag = styled.div`
  background: ${props => props.color};
  border-radius: 30px;
  color: white;
  cursor: pointer;
  display: flex;
  padding: 6px 4px;
  transform-origin: 24px 50%;
  @media screen and (max-width: 1000px) {
    transform: scale(0.75);
  }
`;

const SettingsPlaceholder = styled.div`
  width: 9px;
  height: 16px;
`;

const Link = styled.a`
  color: 'white';
  display: 'inherit';
`;

const TagValue = styled.div<{ flipped: boolean }>`
  font-size: 1.4rem;
  padding: 4px 0;
  display: flex;
  position: relative;
  top: 1px;
  ${({ flipped }) => (flipped ? 'transform: rotate(180deg);' : '')}
`;
const TagUnit = styled.div`
  opacity: 0.8;
  font-size: 0.8rem;
  margin: 4px;
`;
const TagSettings = styled.div`
  color: white;
  font-size: 1.1rem;
  margin: auto 8px;
  cursor: pointer;
  padding-right: 4px;
`;
const TagId = styled.div`
  color: white;
  position: absolute;
  bottom: 100%;
  margin-bottom: 0;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 30px;
  background: ${props => props.color};
  transition: 0.3s margin-right, 0.3s opacity, 0.3s margin-bottom;
  opacity: 0;
  right: auto;
  margin-right: 0;

  &.hovering {
    opacity: 1;
    margin-bottom: 4px;
  }
  &.flipped {
    transform: rotate(180deg);
    margin-right: -42px;
  }
`;
const TagName = styled.div`
  color: white;
  position: absolute;
  bottom: 100%;
  font-size: 0.7rem;
  padding: 6px 12px;
  white-space: nowrap;
  border-radius: 30px;
  background: ${props => props.color};
  transition: 0.3s margin-right, 0.3s opacity, 0.3s margin-bottom;
  opacity: 0;
  margin-bottom: 36px;
  right: auto;
  margin-right: 0;

  &.hovering {
    opacity: 1;
    margin-bottom: 40px;
  }
  &.flipped {
    transform: rotate(180deg);
    margin-right: -42px;
  }
`;

interface SensorTagProps {
  link?: LinkType;
  flipped: boolean;
  timeseries: Timeseries;
  nodeId: number;
  left: number;
  top: number;
  value: number | null;
  color?: string;
  sticky?: boolean;
  onClick?: SensorOverlayClickHandler;
  onSettingsClick?: SensorOverlayClickHandler;
  onLinkClick?: (link: LinkType) => void;
  zIndex?: number;
  strings: VMetadata;
}

interface SensorTagState {
  hovering: boolean;
}

class SensorTag extends Component<SensorTagProps, SensorTagState> {
  static defaultProps: Partial<SensorTagProps> = {
    color: '',
    flipped: false,
    sticky: false,
    value: null,
  };

  constructor(props: SensorTagProps) {
    super(props);
    this.state = {
      hovering: false,
    };
  }

  render() {
    const {
      left,
      top,
      onSettingsClick,
      color,
      flipped,
      timeseries,
      sticky,
      link,
      zIndex,
    } = this.props;
    const { description, unit } = timeseries;
    const { hovering } = this.state;
    const valueComponent = this.renderValue();
    const z = hovering || sticky ? 100 : zIndex || 0;

    return (
      <SensorTagContainer left={left} top={top} flipped={flipped} z={z}>
        {hovering && (
          <TagId
            color={color}
            className={`${hovering || sticky ? 'hovering' : ''} ${
              flipped ? 'flipped' : ''
            }`}
          >
            {timeseries.name}
          </TagId>
        )}
        {description && hovering && (
          <TagName
            color={color}
            className={`${hovering || sticky ? 'hovering' : ''} ${
              flipped ? 'flipped' : ''
            }`}
          >
            {description}
          </TagName>
        )}
        <Tag
          color={color}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onTagClick}
        >
          <TagValue flipped={this.props.flipped}>
            {link ? (
              <Link onClick={this.onLinkClick}>
                {valueComponent}
                <TagUnit>{unit}</TagUnit>
              </Link>
            ) : (
              [valueComponent, <TagUnit key="unit">{unit}</TagUnit>]
            )}
          </TagValue>
          {onSettingsClick ? (
            <TagSettings onClick={this.handleSettingsClick}>
              <Icon type="setting" />
            </TagSettings>
          ) : (
            <SettingsPlaceholder />
          )}
        </Tag>
      </SensorTagContainer>
    );
  }

  private handleSettingsClick = (event: React.MouseEvent) => {
    if (this.props.onSettingsClick) {
      event.stopPropagation();
      this.props.onSettingsClick(this.props.nodeId, this.props.timeseries);
    }
  };

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

  private onLinkClick = () => {
    if (this.props.onLinkClick && this.props.link) {
      this.props.onLinkClick(this.props.link);
    }
  };

  private onTagClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.nodeId, this.props.timeseries);
    }
  };

  private renderValue() {
    const { value, strings } = this.props;
    if (value === null) {
      return HELLIP;
    }

    if (Number.isNaN(+value)) {
      return strings.unknownValue || '???';
    }

    return (
      <StyledOdometer key="odometer">
        <Odometer value={+value} duration={250} format="(d).dd" />
      </StyledOdometer>
    );
  }
}

export default SensorTag;
