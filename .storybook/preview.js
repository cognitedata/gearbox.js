import React from 'react';
import styled from 'styled-components';
import { addParameters, addDecorator } from '@storybook/react';
import { DocsContainer, Preview, SourceState } from '@storybook/addon-docs/dist/blocks';

const Decorator = (fn) => (
  <Wrapper>
    <Content>
      { fn() }
    </Content>
  </Wrapper>
);

addDecorator(Decorator);

addParameters({
  options: {
    showRoots: true,
    selectedPanel: 'docs',
  },
  docs: {
    container: DocsContainer,
    preview: Preview.defaultProps = { withSource: SourceState.OPEN }
  },
});

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;

const Content = styled.div`
  max-width: 1000px;
  width: 100%;
`;
