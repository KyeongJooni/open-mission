/// <reference types="vite/client" />

declare module '*.svg?react' {
  import { SVGProps } from 'react';
  const ReactComponent: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
