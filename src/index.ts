#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';

import { optionDefinitions, sections } from './cliOptions';
import { buildSlackMessage } from './build-message/buildSlackMessage';
import { postMessage } from './post-message/postMessage';
import { initBotConfiguration } from './init/initBotConfiguration';
import * as chalk from 'chalk';
import { getStandardVersionConfig } from './helpers/getStandardVersionConfig';
import {setPackage} from "./package";

const mainDefinitions = [{ name: 'command', defaultOption: true }];

const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];

const config = commandLineArgs(optionDefinitions, {
  camelCase: true,
  argv
});
config.command = mainOptions.command;
const { help } = config;

if (help) {
  const usage = commandLineUsage(sections);
  // Don't delete, it's the help menu
  console.log(usage);
  process.exit();
}

const { command } = mainOptions;
setPackage(config.package);
if (command === 'init') {
  initBotConfiguration();
} else {
  if (!getStandardVersionConfig()) {
    console.log(chalk.yellow('⚠  Standard version configuration is missing! run "version-bot init", aborting...'));
  } else {
    if (command === 'build-message') {
      buildSlackMessage();
    } else if (command === 'post-message') {
      postMessage();
    } else {
      console.log(`Please provide an action...`);
    }
  }
}
