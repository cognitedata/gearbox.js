import React from 'react';
import styled from 'styled-components';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { addReadme, configureReadme } from 'storybook-readme';
import * as Components from '../src';

import { withInfo } from '@storybook/addon-info';
import 'antd/dist/antd.css';

addDecorator(withInfo({maxPropsIntoLine: 1}));

const Wrapper = styled.div`
  table {
    display: table!important;
  }
`;

configureReadme({
  DocPreview: ({children}) => <Wrapper>{children}</Wrapper>,
});

addDecorator(addReadme);

const styles = {
  margin: '1em',
};

const CenterDecorator = storyFn => <div style={styles}>{storyFn()}</div>;

addDecorator(CenterDecorator);

const infoDecorator = (storyFn, options) => {
  if (!options.parameters.info) { options.parameters.info = {}; }

  const component = Components[options.kind];
  const {parameters: {info: {propTablesExclude}}} = options;

  if (!propTablesExclude) { options.parameters.info.propTablesExclude = [] }
  if (component) { options.parameters.info.propTablesExclude.push(component) }

  options.parameters.info.inline = true;

  return storyFn();
};

addDecorator(infoDecorator);
// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
