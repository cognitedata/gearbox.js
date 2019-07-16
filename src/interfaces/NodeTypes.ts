import { Node } from '@cognite/sdk';
import { AntTreeNodeProps } from 'antd/lib/tree';

export type NodePanelType = 'details' | 'events' | 'documents' | 'timeseries';

export interface OnSelectNodeTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Node;
}

export interface OnRightClickNodeTreeParams {
  event: React.MouseEvent<any>;
  node: AntTreeNodeProps;
}

export interface NodeTreeStyles {
  list?: React.CSSProperties;
}

export interface NodeTreeProps {
  modelId: number;
  revisionId: number;
  onSelect?: (onSelect: OnSelectNodeTreeParams) => void;
  defaultExpandedKeys?: number[];
  styles?: NodeTreeStyles;
  onRightClick?: (event: OnRightClickNodeTreeParams) => void;
}
