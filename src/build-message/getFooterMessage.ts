import { getConfig } from '../config';
import { transpileString } from '../helpers/transpileString';

export function getFooterMessage(): string {
  return transpileString(getConfig().footerMessage);
}
