import { configure } from '@storybook/react';
import 'antd/dist/antd.css';

// automatically import all files ending in *.stories.js
// const req = require.context('../stories', true, /.stories.tsx$/);
const req = require.context('../src/components', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
