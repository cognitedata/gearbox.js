import { Tag } from 'antd';
import React from 'react';
import { VOnClick } from 'utils/validators';
import { getColor } from 'utils/colors';

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
