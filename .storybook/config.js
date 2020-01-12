import React from 'react';
import styled from 'styled-components';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { addReadme, configureReadme } from 'storybook-readme';
import { DocsContainer, Preview } from '@storybook/addon-docs/dist/blocks';
import { SourceState } from '@storybook/addon-docs/dist/blocks';


const StoryWrapper = styled.div`
  margin: 1em;
`;

const DocWrapper = styled.div`
  margin: 1em;
  table {
    display: table!important;
  }
`;

configureReadme({
  DocPreview: ({children}) => <DocWrapper>{children}</DocWrapper>,
  StoryPreview: ({children}) => <StoryWrapper>{children}</StoryWrapper>,
});

addDecorator(addReadme);

addParameters({
  docs: {
    container: DocsContainer,
    preview: Preview.defaultProps = { withSource: SourceState.OPEN }
  },
});

const loadStories = () => {
  return [
    require.context('../docs', true, /About.story.mdx/),
    require.context('../src', true, /.(stories|story).(tsx|mdx)$/),
  ];}

configure(loadStories(), module);
