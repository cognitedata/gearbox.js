import { Node } from '@cognite/sdk';
import { AntTreeNodeProps } from 'antd/lib/tree';
import { AnyIfEmpty } from './CommonTypes';

export type NodePanelType = 'details' | 'events' | 'documents' | 'timeseries';

export interface OnSelectNodeTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: Node;
}

export interface OnRightClickNodeTreeParams {
  event: React.MouseEvent<HTMLElement>;
  node: AntTreeNodeProps;
}

export interface NodeTreeStyles {
  list?: React.CSSProperties;
}

export interface NodeTreeProps {
  modelId: number;
  revisionId: number;
  onSelect?: (onSelect: OnSelectNodeTreeParams) => void;
  onRightClick?: (event: OnRightClickNodeTreeParams) => void;
  defaultExpandedKeys?: number[];
  styles?: NodeTreeStyles;
  theme?: AnyIfEmpty<{}>;
}
