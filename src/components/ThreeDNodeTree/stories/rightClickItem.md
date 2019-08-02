## Right click item in tree 

<!-- STORY -->

#### Description:

Users can customize right click behaviors through the onRightClick prop of the component. 
The following is an example of popping up a customized context menu when a tree node is right clicked. From the input of onRightClick function, users are able to access the tree node and click event information, which can be applied to define different actions the items in the menu. 

#### Usage:

```typescript jsx
import 'antd/dist/antd.css';
import React from 'react';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import { ClickParam } from 'antd/lib/menu';
import { ThreeDNodeTree, OnRightClickNodeTreeParams } from '@cognite/gearbox';
```
```typescript jsx
interface RightClickState {
  visible: boolean;
  rightClickedNode?: string;
  menuStyle: {
    [_: string]: string;
  };
}
```
```typescript jsx
class ExampleComponent extends React.Component<{}, RightClickState> {
  menu: HTMLDivElement | null = null;
  constructor(props: {}) {
    super(props);
    this.state = {
      visible: false,
      menuStyle: {},
    };
  }
  renderSubMenu = () => {
    return this.state.visible ? (
      <Menu
        theme="dark"
        style={this.state.menuStyle}
        onClick={() => {
          if (this.state.rightClickedNode) {
            alert(this.state.rightClickedNode);
          }
        }}
      >
        <MenuItem>Menu Item 1</MenuItem>
        <MenuItem>Menu Item 2</MenuItem>
      </Menu>
    ) : (
      <></>
    );
  };
  componentDidMount() {
    document.body.addEventListener('click', (e: MouseEvent) => {
      // Ignore clicks on the context menu itself
      if (this.menu && this.menu.contains(e.target as Node)) {
        return;
      }
      // Close context menu when click outside of it
      this.setState({
        visible: false,
      });
    });
  }
  render() {
    return (
      <>
        <ThreeDNodeTree
          modelId={6265454237631097}
          revisionId={3496204575166890}
          onRightClick={(e: OnRightClickNodeTreeParams) => {
            this.setState({
              visible: true,
              menuStyle: {
                position: 'fixed',
                top: `${e.event.clientY}px`,
                left: `${e.event.clientX + 20}px`,
              },
              rightClickedNode: e.node.props.title,
            });
          }}
        />
        <div ref={node => (this.menu = node)}>{this.renderSubMenu()}</div>
      </>
    );
  }
}
```
