import { RevealNode3D } from '@cognite/sdk';
import { AntTreeNodeProps } from 'antd/lib/tree';
import { CSSProperties, MouseEvent } from 'react';
import { Theme } from '../../interfaces';

export interface TreeNodeData {
  title: string;
  key: number | string;
  children?: TreeNodeData[];
  isLeaf?: boolean;
  [name: string]: any;
}

export interface TreeNodeType {
  title: string;
  description?: string;
  children?: TreeNodeType[];
  [name: string]: any;
}

export interface OnSelectNodeTreeParams {
  key: number | string;
  title: string;
  isLeaf?: boolean;
  node?: RevealNode3D;
}

export interface OnRightClickNodeTreeParams {
  event: MouseEvent<HTMLElement>;
  node: AntTreeNodeProps;
}

export interface NodeTreeStyles {
  list?: CSSProperties;
}

export interface NodeTreeProps {
  /**
   * model ID number
   */
  modelId: number;
  /**
   * model revision ID number
   */
  revisionId: number;
  /**
   * Triggers when a node is selected
   */
  onSelect?: (onSelect: OnSelectNodeTreeParams) => void;
  /**
   * Triggers when a node is right clicked
   */
  onRightClick?: (event: OnRightClickNodeTreeParams) => void;
  /**
   * List of node ids to be expanded by default
   */
  defaultExpandedKeys?: number[];
  /**
   * Object that defines inline CSS styles for inner elements of the component.
   */
  styles?: NodeTreeStyles;
  /**
   * @ignore
   */
  theme?: Theme;
}
