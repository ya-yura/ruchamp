'use client';

import * as React from 'react';
import {
  FluentProvider,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
  webDarkTheme,
} from '@fluentui/react-components';
import { useServerInsertedHTML } from 'next/navigation';
import DictionaryProvider, { Dictionary } from './dictionary-provider';

export function Providers({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const [renderer] = React.useState(() => createDOMRenderer());
  const didRenderRef = React.useRef(false);

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return;
    }
    didRenderRef.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <FluentProvider theme={webDarkTheme}>
          <DictionaryProvider dictionary={dictionary}>
            {children}
          </DictionaryProvider>
        </FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
}
