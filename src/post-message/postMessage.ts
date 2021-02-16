import { BOT_MESSAGE_JSON } from '../types';
import { post } from 'request';
import * as fs from 'fs';
import { getConfig } from '../config';
import * as chalk from 'chalk';
import * as debug from 'debug';

export function postMessage() {
  if (!fs.existsSync(BOT_MESSAGE_JSON)) {
    return console.log(chalk.yellow('⚠  Unable to find message file, aborting...'));
  }
  const blocks = fs.readFileSync(BOT_MESSAGE_JSON, { encoding: 'UTF-8' });
  fs.unlinkSync(BOT_MESSAGE_JSON);

  const { webHookLink } = getConfig();
  post({ url: webHookLink, json: { blocks } }, (error, response, body) => {
    if (debug.enabled('request')) {
      const log = debug('request');
      log(`Error: %o`, error);
      log(`Response: %o`, response);
      log(`Body: %o\n`, body);
    }
    const { statusCode } = response;
    if (statusCode === 200) {
      console.log(chalk.green('✓ Message successfully sent to slack bot 🤖'));
    } else {
      console.log(chalk.red('⚠  Unable to post message'), { statusCode, error });
    }
  });
}
