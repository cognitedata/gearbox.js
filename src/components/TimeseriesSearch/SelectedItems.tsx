// Copyright 2020 Cognite AS
import { Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { getColorByString } from '../../utils/colors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`;

interface SelectedTimeseriesProps {
  selectedItems: Item[];
  onItemClose: (closedItem: Item) => void;
}

export interface Item {
  id: number;
  name: string;
}

export class SelectedItems extends React.Component<SelectedTimeseriesProps> {
  static defaultProps = {
    selectedItems: [],
    onItemClose: null,
  };

  render() {
    const { selectedItems, onItemClose } = this.props;
    return (
      <Wrapper>
        <span style={{ marginRight: '8px' }}>
          <b>Selected:</b>
        </span>
        {selectedItems &&
          selectedItems.map(item => (
            <Tag
              key={item.id}
              onClose={() => onItemClose(item)}
              closable={true}
              color={getColorByString(item.id.toString())}
            >
              {item.name || ''}
            </Tag>
          ))}
      </Wrapper>
    );
  }
}
