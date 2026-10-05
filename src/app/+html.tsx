/**
 * Web document root. Used when `web.output` is `static` / `server` (Node render only: keep the
 * imports DOM-free and light). With the current `single` output Expo serves its default
 * index.html instead, and the root layout applies the same canvas / overscroll / viewport
 * settings at runtime (`useWebDocument`).
 */
import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

import { lightColors } from '@/theme/tokens/colors';

const documentStyles = `
html, body { background-color: ${lightColors.background}; overscroll-behavior: none; }
body { -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased; }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content={lightColors.background} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: documentStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
