import * as React from 'react';
import DictionaryProvider, { Dictionary } from './dictionary-provider';

export function Providers({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
  );
}
