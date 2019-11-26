import { Icon } from 'antd';
import React, { KeyboardEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import * as CustomIcon from './Icons';

const initialState = {
  searchPhrase: '',
  amountOfResults: 0,
  currentResult: 0,
};

export interface ComponentProps {
  visible: boolean;
  svg: SVGSVGElement;
  isDesktop: boolean;
  searchClassName: string;
  currentSearchClassName: string;
  openSearch: () => void;
  zoomOnCurrentAsset: (currentAsset: Element | null) => void;
  handleCancelSearch: () => void;
  addCssClassesToMetadataContainer: ({
    condition,
    className,
  }: {
    condition: (metadataNode: Element) => boolean;
    className: string;
  }) => void;
  addCssClassesToSvgText: ({
    condition,
    className,
  }: {
    condition: (metadataNode: Element) => boolean;
    className: string;
  }) => void;
  onFocus: () => void;
  onBlur: () => void;
  // Subscribe to search input changes
  handleSearchChange?: (value?: string) => void;
}

interface ComponentState {
  searchPhrase: string;
  amountOfResults: number;
  currentResult: number;
}

class SVGViewerSearch extends React.Component<ComponentProps, ComponentState> {
  static defaultProps = {
    searchClassName: 'search-result',
    currentSearchClassName: 'current-search-result',
  };

  searchInput: React.RefObject<HTMLInputElement>;

  constructor(props: ComponentProps) {
    super(props);
    this.state = initialState;
    this.searchInput = React.createRef();
  }

  componentDidUpdate(prevProps: ComponentProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setFocus();
    }
    if (prevProps.visible && !this.props.visible) {
      this.resetSearch();
    }
  }

  render() {
    const { isDesktop, visible } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <StyledSearch
        data-test-id="svg-viewer-search"
        onKeyDown={this.handleKeyDown}
        onMouseDown={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        onMouseUp={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {isDesktop ? (
          <React.Fragment>
            <SearchNavigationNext
              onClick={() => this.handleNavigateSearchResult(1)}
              data-test-id="next-result-svg"
            >
              <Icon type="down" />
            </SearchNavigationNext>
            <SearchNavigationPrev
              onClick={() => this.handleNavigateSearchResult(-1)}
              data-test-id="prev-result-svg"
            >
              <Icon type="up" />
            </SearchNavigationPrev>
          </React.Fragment>
        ) : (
          <Icon
            type="arrow-left"
            onClick={this.handleCancelSearch}
            data-test-id="close-search-svg"
          />
        )}

        <SearchInputContainer>
          <SearchInput
            value={this.state.searchPhrase}
            onChange={this.handleSearchPhraseChange}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            placeholder="Search"
            ref={this.searchInput}
            data-test-id="search-input-svg"
          />
          <SearchResultsCounter hidden={this.state.amountOfResults === 0}>
            {this.state.currentResult}/{this.state.amountOfResults}
          </SearchResultsCounter>
        </SearchInputContainer>
        {isDesktop && (
          <CloseButton
            onClick={this.handleCancelSearch}
            data-test-id="close-search-svg"
          >
            <CustomIcon.Close />
          </CloseButton>
        )}
        {!isDesktop && this.state.amountOfResults ? (
          <React.Fragment>
            <SearchNavigationNext
              onClick={() => this.handleNavigateSearchResult(1)}
              data-test-id="next-result-svg"
            >
              <Icon type="down" />
            </SearchNavigationNext>
            <SearchNavigationPrev
              onClick={() => this.handleNavigateSearchResult(-1)}
              data-test-id="prev-result-svg"
            >
              <Icon type="up" />
            </SearchNavigationPrev>
          </React.Fragment>
        ) : null}
      </StyledSearch>
    );
  }

  setFocus = () => {
    setTimeout(() => {
      if (this.searchInput.current) {
        this.searchInput.current.focus();
      }
    }, 0);
  };

  resetSearch = () => {
    this.setState(initialState);
  };

  resetSearchResults = () => {
    const { svg, searchClassName, currentSearchClassName } = this.props;
    if (!svg) {
      return;
    }
    const searchResults = svg.querySelectorAll(`.${searchClassName}`);
    if (searchResults.length) {
      Array.from(searchResults).forEach(searchResult => {
        searchResult.classList.remove(searchClassName);
        searchResult.classList.remove(currentSearchClassName);
      });
    }
  };

  handleMouseDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13 && this.state.amountOfResults) {
      this.handleNavigateSearchResult(1);
    }
    // Overriding ctrl+F
    const FKeyCode = 70;
    if ((e.ctrlKey || e.metaKey) && e.keyCode === FKeyCode) {
      e.preventDefault();
    }
  };

  handleNavigateSearchResult = (move: number) => {
    const { currentResult, amountOfResults } = this.state;
    const {
      svg,
      zoomOnCurrentAsset,
      searchClassName,
      currentSearchClassName,
    } = this.props;
    const searchResults = svg.querySelectorAll(`.${searchClassName}`);
    const currentSearchResult = svg.querySelector(`.${currentSearchClassName}`);
    if (!currentSearchResult) {
      return;
    }
    let nextResult = currentResult + move;
    if (move === 1 && nextResult > amountOfResults) {
      nextResult = 1;
    } else if (move === -1 && nextResult === 0) {
      nextResult = amountOfResults;
    }
    currentSearchResult.classList.remove(currentSearchClassName);
    searchResults[nextResult - 1].classList.add(currentSearchClassName);
    this.setState({ currentResult: nextResult });
    zoomOnCurrentAsset(searchResults[nextResult - 1]);
  };

  handleCancelSearch = () => {
    this.resetSearch();
    this.resetSearchResults();
    this.props.handleCancelSearch();
  };

  handleSearchPhraseChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const {
      svg,
      addCssClassesToMetadataContainer,
      addCssClassesToSvgText,
      zoomOnCurrentAsset,
      searchClassName,
      currentSearchClassName,
      handleSearchChange,
    } = this.props;
    this.resetSearchResults();
    if (!value) {
      this.resetSearch();
    } else {
      const regexp = new RegExp(`(${value})`, 'gi');
      let amountOfResults = 0;
      let currentResult = 0;
      const isMatchingSearchPhrase = (textNode: Element) =>
        !!(textNode.textContent && textNode.textContent.match(regexp));
      addCssClassesToMetadataContainer({
        condition: isMatchingSearchPhrase,
        className: searchClassName,
      });
      addCssClassesToSvgText({
        condition: isMatchingSearchPhrase,
        className: searchClassName,
      });

      // count all results and set current search result for navigation
      const searchResults = svg.querySelectorAll(`.${searchClassName}`);
      amountOfResults = searchResults.length;
      if (amountOfResults) {
        currentResult = 1;
        searchResults.forEach(item => {
          item.classList.remove(currentSearchClassName);
        });
        const currentSearchResult = searchResults[0];
        currentSearchResult.classList.add(currentSearchClassName);
        zoomOnCurrentAsset(searchResults[0]);
      }
      this.setState({
        searchPhrase: value,
        amountOfResults,
        currentResult,
      });
    }
    if (handleSearchChange) {
      handleSearchChange(value);
    }
  };
}

const StyledSearch = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 100%;
  height: 65px;
  padding: 5px 5px 5px 15px;
  border-radius: 0;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;

  @media (min-width: 992px) {
    top: 60px;
    right: 20px;
    width: auto;
    height: auto;
    padding-left: 5px;
    border-radius: 5px;
    border: 1px solid #bfbfbf;
  }
`;

const SearchNavigation = styled.button`
  position: relative;
  height: 100%;
  background: none;
  border: none;
  font-size: 10px;
  outline: none;
  cursor: pointer;
`;

const SearchNavigationPrev = styled(SearchNavigation)`
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -5px;
    width: 2px;
    height: 100%;
    background: #f5f5f5;
  }
`;
const SearchNavigationNext = styled(SearchNavigation)``;

const SearchResultsCounter = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875em;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  outline: none;
  border: none;

  &:focus {
    outline: none;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
  padding-left: 15px;
  padding-right: 40px;

  @media (min-width: 992px) {
    width: 200px;
  }
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export default SVGViewerSearch;
