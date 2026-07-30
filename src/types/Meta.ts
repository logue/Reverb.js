/** Meta information */
export type Meta = {
  /** Version */
  version: string;
  /** Build Date */
  date: string;
};

/** Meta information, injected at build time */
export const Meta: Meta = {
  version: __APP_VERSION__,
  date: __BUILD_DATE__,
};
