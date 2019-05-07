import 'antd/dist/antd.css';

import React from 'react';
import styled from 'styled-components';
import { addDecorator, configure } from '@storybook/react';
import { addReadme, configureReadme } from 'storybook-readme';

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

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
