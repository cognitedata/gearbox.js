import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import List from 'antd/lib/list';

import * as propShapes from 'utils/propShapes';
import EmptyView from 'components/EmptyView';
import TagListTitle from 'components/TagListTitle';
import CircleButton from 'components/shared/CircleButton';

import Highlighter from 'react-highlight-words';

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  padding: 0 20px;
`;

const StyledList = styled(List)`
  margin-bottom: 40px;
`;

const ListItem = styled(List.Item)`
  /* no prop for removing border between items, so override */
  border-width: ${props => (props.bordered ? 1 : 0)}px !important;
  &:hover {
    color: ${props => props.theme.colors.primary};
    .ant-list-item-meta-title,
    .ant-list-item-meta-description {
      color: ${props => props.theme.colors.primary};
    }
    cursor: pointer;
  }
  .ant-list-item-content-single {
    justify-content: space-between;
  }
`;

const ListItemMeta = styled(List.Item.Meta)`
  .ant-list-item-meta-description {
    word-wrap: break-word !important;
  }
  padding-right: 20px;
`;

const ListItemMain = styled.span`
  text-decoration: ${props => (props.disabled ? 'line-through' : 'initial')};
  display: flex;
  flex-direction: column;
`;

const ListItemSide = styled.span`
  ${props => props.theme.flex.center};
`;

const HighlightSpan = styled.span`
  background: yellow;
`;

const EmptyViewWrapper = styled.div`
  padding-top: 20px;
`;

const propTypes = {
  listData: PropTypes.arrayOf(propShapes.listData), // eslint-disable-line react/no-typos
  className: PropTypes.string,
  renderActions: PropTypes.func,
  listTitle: PropTypes.string,
  renderListActions: PropTypes.func,
  emptyText: PropTypes.string,
  isLoading: PropTypes.bool,
  isLoadingText: PropTypes.string,
  history: propShapes.history.isRequired,
  isBordered: PropTypes.bool,
  lastSearchPhrase: PropTypes.string,
  envPath: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const defaultProps = {
  className: 'taglist',
  renderListActions: () => {},
  listData: [],
  renderActions:
    process.env.REACT_APP_ENV !== 'production'
      ? () => <CircleButton iconType="plus" onClick={() => {}} type="success" />
: () => {},
  listTitle: '',
  emptyText: '',
  isLoading: false,
  isLoadingText: '',
  isBordered: true,
  lastSearchPhrase: '',
};

const metrics = Metrics.create('TagList');

const TagList = props => {
  const {
    listData,
    history,
    listTitle,
    emptyText,
    renderActions,
    renderListActions,
    isLoading,
    isLoadingText,
    isBordered,
    lastSearchPhrase,
    t,
  } = props;

  const matchText = text => {
    if (!text) {
      return '';
    }
    if (!lastSearchPhrase.length) {
      return text;
    }
    const searchWords = lastSearchPhrase.split(' ');
    return (
      <Highlighter
        highlightTag={HighlightSpan}
    searchWords={searchWords}
    textToHighlight={text}
    autoEscape
    />
  );
  };

  const renderList = (items, envPath) => {
    if (items.length === 0) {
      return <React.Fragment />;
    }

    return (
      <React.Fragment>
        <StyledList
          bordered={isBordered}
    dataSource={items}
    locale={{
      emptyText: t('noData', {
        defaultValue: 'No data',
      }),
    }}
    renderItem={(el, position) => (
      <ListItem
        // Workaround Warning: Received `true` for a non-boolean attribute.
        // https://github.com/styled-components/styled-components/issues/1198
        bordered={isBordered ? 1 : 0}
    key={el.id}
    onClick={() => {
      metrics.track('Asset select', {
        ...el,
        position,
        query: lastSearchPhrase,
        queryLength: (lastSearchPhrase || '').length,
      });
      history.push(`${envPath}/asset/${el.id}/overview/`);
    }}
    data-test-id="scanner-result-items"
    >
    <ListItemMain disabled={el.complete}>
    <ListItemMeta
      title={el.isLoading ? 'Loading...' : matchText(el.title)}
    description={el.isLoading ? '' : matchText(el.description)}
    />
    <div>{el.detail}</div>
    </ListItemMain>
    <ListItemSide>{renderActions(el)}</ListItemSide>
    </ListItem>
  )}
    />
    {renderListActions()}
    </React.Fragment>
  );
  };

  return (
    <Wrapper className={props.className}>
      {listTitle && (
        <TagListTitle data-test-id="scanner-results-title" title={listTitle} />
)}
  {listData.length !== 0 ? (
    renderList(listData, props.envPath)
  ) : (
    <EmptyViewWrapper>
      <EmptyView
        isLoading={isLoading}
    loadingText={isLoadingText}
    text={emptyText}
    />
    </EmptyViewWrapper>
  )}
  </Wrapper>
);
};

TagList.propTypes = propTypes;
TagList.defaultProps = defaultProps;

export default withRouter(withTheme(withNamespaces('TagList')(TagList)));
