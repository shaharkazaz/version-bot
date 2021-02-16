import { Config } from './types';

export const defaultConfig: Config = {
  headerMessages: [
    'Fresh out of the oven! *{{version}}* was just released 👨‍🍳‍:',
    'A new version was born! we named it *{{version}}* 👼:',
    'Ladies and gentleman, we proudly present *{{version}}* 🥂:',
    'Version *{{version}}* has just landed 🚀:'
  ],
  footerMessage:
    'For more information about these commits view the <{{compareChangesLink}}|code comparison to previous version>'
};
