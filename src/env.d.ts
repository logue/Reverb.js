/// <reference types="@rsbuild/core/types" />
/// <reference types="@rslib/core/types" />

declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;

declare module '*.flac' {
  const src: string;
  export default src;
}
