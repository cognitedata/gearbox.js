import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import { AnyIfEmpty } from '../interfaces';
import { defaultTheme } from '../theme/defaultTheme';

type GearboxThemeKey = keyof typeof defaultTheme;

export interface GearboxThemeOptional {
  fontFamily?: string;
  fontSize?: string;
  listHighlight?: string;
}

export type GearboxTheme = { [key in GearboxThemeKey]?: string } &
  GearboxThemeOptional;

const ThemeWrapper = ({
  theme,
  children,
}: {
  theme: AnyIfEmpty<{}> & { gearbox?: GearboxTheme };
  children: React.ReactChild;
}) => {
  const external = theme && theme.gearbox ? theme.gearbox : {};
  const resultTheme = {
    gearbox: {
      ...defaultTheme,
      ...external,
    },
  };
  return <ThemeProvider theme={resultTheme}>{children}</ThemeProvider>;
};

ThemeWrapper.defaultProps = { theme: { gearbox: { ...defaultTheme } } };

const WithThemeComponent = withTheme(ThemeWrapper);

export const withDefaultTheme = <
  C extends React.ComponentType<React.ComponentProps<C>>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(
  Component: C
): React.ComponentType<ResolvedProps> => {
  return class ThemeWrappedComponent extends React.Component<ResolvedProps> {
    static displayName = `${Component.displayName || Component.name}`;

    render() {
      return (
        <WithThemeComponent>
          <Component
            {...(this.props as JSX.LibraryManagedAttributes<
              C,
              React.ComponentProps<C>
            >)}
            key=""
          />
        </WithThemeComponent>
      );
    }
  };
};
