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

export function withDefaultTheme<P>(
  WrapperComponent: React.ComponentType<P>
): React.FunctionComponent<P> {
  return (props: P) => {
    const { ...otherProps } = props;
    return (
      <WithThemeComponent>
        <WrapperComponent {...otherProps} />
      </WithThemeComponent>
    );
  };
}
