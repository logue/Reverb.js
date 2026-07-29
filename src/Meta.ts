import type { MetaType } from '@/types/MetaType';

/** Build-time metadata injected via bundler defines. */
const meta: MetaType = {
  version: __APP_VERSION__,
  date: __BUILD_DATE__,
};
export default meta;
