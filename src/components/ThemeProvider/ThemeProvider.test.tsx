import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../../theme/defaultTheme';
import { ThemeProvider } from './ThemeProvider';

configure({ adapter: new Adapter() });

describe('ThemeProvider', () => {
  it('Should render without exploding', () => {
    const wrapper = mount(
      <ThemeProvider theme={{}}>
        <div className="theme-provider-child" />
      </ThemeProvider>
    );
    expect(wrapper.find(ThemeProvider)).toHaveLength(1);
    expect(wrapper.find('.theme-provider-child')).toHaveLength(1);
  });

  it('Should pass theme to child component', () => {
    const Child = styled.div`
      ${props => {
        expect(props.theme.gearbox.primaryColor).toBe('red');
        expect(props.theme.gearbox.textColor).toBe('magenta');
        return '';
      }}
    `;

    mount(
      <ThemeProvider theme={{ primaryColor: 'red', textColor: 'magenta' }}>
        <Child />
      </ThemeProvider>
    );
  });

  it('Should merge default theme', () => {
    const Child = styled.div`
      ${props => {
        expect(props.theme.gearbox.primaryColor).toBe(
          defaultTheme.primaryColor
        );
        expect(props.theme.gearbox.textColor).toBe(defaultTheme.textColor);
        expect(props.theme.gearbox.containerColor).toBe('green');
        return '';
      }}
    `;

    mount(
      <ThemeProvider theme={{ containerColor: 'green' }}>
        <Child />
      </ThemeProvider>
    );
  });
});
