'use client';

import * as React from 'react';
import {
  FluentProvider,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import { useServerInsertedHTML } from 'next/navigation';
import DictionaryProvider, { Dictionary } from './dictionary-provider';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Providers({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const [renderer] = React.useState(() => createDOMRenderer());
  const didRenderRef = React.useRef(false);
  const pathname = usePathname();
  const lightThemeRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];
  const isLightTheme = lightThemeRoutes.some((route) =>
    pathname.includes(route),
  );

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return;
    }
    didRenderRef.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <RendererProvider renderer={renderer}>
      <SessionProvider>
        <SSRProvider>
          <FluentProvider theme={isLightTheme ? webLightTheme : webDarkTheme}>
            <DictionaryProvider dictionary={dictionary}>
              {children}
            </DictionaryProvider>
          </FluentProvider>
        </SSRProvider>
      </SessionProvider>
    </RendererProvider>
  );
}
