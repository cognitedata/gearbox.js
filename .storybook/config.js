import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import 'antd/dist/antd.css';


const styles = {
  margin: '1em',
};
const CenterDecorator = storyFn => <div style={styles}>{storyFn()}</div>;
addDecorator(CenterDecorator);

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
