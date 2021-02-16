import { Config } from './types';
import * as debug from 'debug';
import { defaultConfig } from './defaultConfig';
import { getStandardVersionConfig } from './helpers/getStandardVersionConfig';

let config: Config;
let userConfig: Config;

export function getConfig(): Config {
  if (!config) {
    userConfig = getStandardVersionConfig()['version-bot'] || {};
    config = { ...defaultConfig, ...userConfig };
  }
  if (debug.enabled('config')) {
    const log = debug('config');
    log(`Default: %o`, defaultConfig);
    log(`User: %o`, userConfig);
    log(`Merged: %o\n`, config);
  }
  return config;
}
