/// <reference types="vite/client" />

declare const ENABLE_PLAYGROUND: string;

declare module '*.svg?react' {
  import { SVGProps } from 'react';
  const ReactComponent: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PLAYGROUND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
