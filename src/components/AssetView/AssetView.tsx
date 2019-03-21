import { Tag } from 'antd';
import React from 'react';
import { VOnClick } from 'utils/validators';

interface AssetViewProps {
  asset: {
    id: number;
    name?: string;
    path?: string[];
    description?: string;
    metadata?: {
      ASSETSCOPENAME?: string;
      DESCRIPTION?: string;
      NAME?: string;
      PARENTUID?: string;
      SOURCE?: string;
      SOURCEID?: string;
      SOURCE_DB?: string;
      SOURCE_TABLE?: string;
      TYPE?: string;
      UID?: string;
    };
  };
  onClick?: VOnClick;
  onClose?: () => void;
  color?: boolean | string;
}

const ColorList = [
  '#0097e6',
  '#e1b12c',
  '#8E44AD',
  '#c23616',
  '#40739e',
  '#273c75',
  '#8c7ae6',
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
];

const hashCode = (a: string) =>
  String(a)
    .split('')
    .map(c => c.charCodeAt(0))
    .reduce((hash, char) => 31 * hash + char || 0, 0);

const getColor = (value: any) =>
  ColorList[
    // JS supports negative mods, so we need to force it to be positive. BOOOOO!
    (((typeof value === 'number' ? value : hashCode(value)) %
      ColorList.length) +
      ColorList.length) %
      ColorList.length
  ];

const AssetView = (props: AssetViewProps) => {
  const { asset, onClick, onClose, color } = props;

  if (!props.asset) {
    return null;
  }

  let tagColor;
  if (typeof color === 'string') {
    tagColor = color;
  } else if (typeof color === 'boolean' && color) {
    tagColor = getColor(+asset.id);
  }

  return (
    <Tag
      style={{ display: 'inline-block' }}
      onClick={onClick}
      closable={!!onClose}
      afterClose={onClose}
      color={tagColor}
    >
      {asset.name || ''}
    </Tag>
  );
};

export default AssetView;
