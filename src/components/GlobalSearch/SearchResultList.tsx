// Copyright 2020 Cognite AS
import { SearchItem, RenderSearchItem, ItemCallback } from '.';
import React, { useState, useCallback } from 'react';
import { withDefaultTheme } from '../../hoc';
import styled from 'styled-components';

type SearchResultListProps = {
  strings: any;
  items: SearchItem[];
  renderSearchItem: RenderSearchItem;
  onItemSelected: ItemCallback;
  onItemHover: ItemCallback;
};

export function SearchResultList({
  strings,
  items,
  renderSearchItem,
  onItemSelected,
  onItemHover,
}: SearchResultListProps) {
  const [numItemsToShow, setNumItemsToShow] = useState(10);
  const handleSeeMoreClicked = useCallback(() => {
    setNumItemsToShow(numItemsToShow + 10);
  }, [numItemsToShow]);

  if (items.length == 0) {
    return (
      <SearchResultListContainer>
        <li>
          <i>{strings.emptySearch}</i>
        </li>
      </SearchResultListContainer>
    );
  }

  const hasMoreItems = numItemsToShow < items.length;
  return (
    <SearchResultListContainer>
      {items.slice(0, numItemsToShow).map(item => (
        <SearchResultItem
          key={item.resource.id}
          onClick={() => onItemSelected(item)}
          onMouseOver={() => onItemHover(item)}
        >
          {renderSearchItem(strings, item)}
        </SearchResultItem>
      ))}
      {hasMoreItems ? (
        <a
          onClick={handleSeeMoreClicked}
          style={{ display: 'inline-block', marginTop: '8px' }}
        >
          See More
        </a>
      ) : null}
    </SearchResultListContainer>
  );
}

const SearchResultListContainer = withDefaultTheme(styled.ul`
  list-style: none;
  padding-left: 0px;
`);

const SearchResultItem = withDefaultTheme(styled.li`
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.gearbox.selectColor};
  }
`);
