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
  constructor(props:{}) {
    super(props);
    this.state = {
      visible: false,
      menuStyle: {},
    };
  }
  showSubMenu = () => {
    return this.state.visible ? (
      <Menu
        theme="dark"
        style={this.state.menuStyle}
        onClick={(params: ClickParam) => {
          if (this.state.rightClickedNode) {
            switch (params.key) {
              case '1': {
                alert('1: ' + this.state.rightClickedNode);
                break;
              }
              case '2': {
                alert('2: ' + this.state.rightClickedNode);
                break;
              }
              default:
                break;
            }
          }
        }}
      >
        <MenuItem key="1">Menu Item 1</MenuItem>
        <MenuItem key="2">Menu Item 2</MenuItem>
      </Menu>
    ) : (
      <></>
    );
  };
  componentDidMount() {
    document.addEventListener('click', () => {
      this.setState({
        visible: false,
      });
    });
  }
  render() {
    return (
      <>
        <ThreeDNodeTree
          modelId={0}
          revisionId={0}
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
        {this.showSubMenu()}
      </>
    );
  }
}
```
