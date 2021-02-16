import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as ora from 'ora';
import { getStandardVersionConfig } from '../helpers/getStandardVersionConfig';
import { writeJson } from '../helpers/writeJson';
import { getPackage } from '../package';
import { ConfigOrigin } from '../types';

const defaultStandardVersionConfig = (webHookLink: string) => ({
  scripts: {
    prechangelog: 'npm run version-bot:build-message'
  },
  'version-bot': { webHookLink }
});

function startSpinner(msg: string) {
  return ora().start(msg);
}

function writeToPackage(_package) {
  writeJson('package.json', _package);
}

function addBotScriptsToPackage() {
  const _package = getPackage();
  _package.scripts = {
    ..._package.scripts,
    'version-bot:build-message': 'version-bot build-message',
    'version-bot:post-message': 'version-bot post-message'
  };
  writeToPackage(_package);
}

function addConfigToPackage(webHookLink: string) {
  const _package = getPackage();
  _package['standard-version'] = defaultStandardVersionConfig(webHookLink);
  writeToPackage(_package);
}

function writeToJSConfigFile(config) {
  const data = `module.export = ${JSON.stringify(config, null, 2)};`;
  fs.writeFileSync('.versionrc.js', data);
}

function createVersionFile(file: '.versionrc.json' | '.versionrc.js', webHookLink: string) {
  const fileType = file.substring(file.lastIndexOf('.') + 1);
  const defaultConfig = defaultStandardVersionConfig(webHookLink);
  if (fileType === 'json') {
    writeJson(file, defaultConfig);
  } else {
    writeToJSConfigFile(defaultConfig);
  }
}

function updateConfigurationFile(config, origin: ConfigOrigin, webHookLink: string) {
  const script = `npm run version-bot:build-message`;
  const current = config.scripts?.prechangelog;
  const updated = (current && `${current} && ${script}`) || `${script}`;

  config.scripts = {
    ...config.scripts,
    prechangelog: updated
  };

  config['version-bot'] = { webHookLink };

  switch (origin) {
    case 'package.json':
      writeToPackage({
        ...getPackage(),
        'standard-version': config
      });
      break;
    case '.versionrc.json':
      writeJson(origin, config);
      break;
    case '.versionrc.js':
      writeToJSConfigFile(config);
      break;
  }
}

function addConfigurationFile(webHookLink: string) {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'file',
        message: 'Choose where to add the version-bot configuration',
        choices: ['package.json', '.versionrc.json', '.versionrc.js']
      }
    ])
    .then(({ file }: { file: ConfigOrigin }) => {
      if (file === 'package.json') {
        addConfigToPackage(webHookLink);
      } else {
        createVersionFile(file, webHookLink);
      }
    });
}

function inquireWebHookLink() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'link',
        message: 'Please enter your slack bot incoming web-hooks link'
      }
    ])
    .then(({ link }) => link);
}

export async function initBotConfiguration() {
  console.log('🤖 Setting up version-bot 🤖');
  console.log('============================\n');
  let spinner = startSpinner('Adding version-bot scripts to package.json');
  addBotScriptsToPackage();
  spinner.succeed('Added version-bot scripts to package.json');
  const webHookLink = await inquireWebHookLink();
  spinner = startSpinner('Searching for a standard-version configuration 🔎');
  const { config, origin } = getStandardVersionConfig({ withOrigin: true });
  let msg = config ? `Configuration found in ${origin} file` : 'Standard version configuration is missing';
  spinner.info(msg);
  if (config) {
    updateConfigurationFile(config, origin, webHookLink);
    spinner.succeed();
  } else {
    await addConfigurationFile(webHookLink);
  }
  msg = config ? `Updated ${origin} with version-bot configuration` : `Configuration successfully created`;
  spinner.succeed(msg);
  console.log('\nJust run "version-bot:post-message" after your version release!');
  console.log("We're Done! ✨");
}
