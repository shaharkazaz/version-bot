import { getConfig } from '../config';
import { coerceArray } from '../helpers/coerceArray';
import { transpileString } from '../helpers/transpileString';

export function getHeaderMessage() {
  const { headerMessages, notify } = getConfig();
  const randomIndex = Math.floor(Math.random() * headerMessages.length);
  const headerText = transpileString(headerMessages[randomIndex]);
  if (notify) {
    const notifiers = coerceArray(notify)
      .map(target => `<!${target}>`)
      .join(' ');
    return `${notifiers} ${headerText}`;
  }

  return headerText;
}
