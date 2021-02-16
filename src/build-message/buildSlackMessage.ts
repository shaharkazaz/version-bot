import { getChangelogAST } from './getChangelogAST';
import { ASTNode, BOT_MESSAGE_JSON } from '../types';
import { extractChangelogSections } from './extractChangelogSections';
import { convertMsgToSlackFormat } from './convertMsgToSlackFormat';
import * as fs from 'fs-extra';
import * as debug from 'debug';
import * as chalk from "chalk";

function isASTEmpty(ast: ASTNode): boolean {
  return ast.children.length === 0;
}

export async function buildSlackMessage() {
  const ast = await getChangelogAST();
  if (debug.enabled('ast')) {
    const log = debug('ast');
    log(`AST: %o\n`, ast);
  }
  if (isASTEmpty(ast)) {
    console.log(chalk.blueBright('ℹ  No version change detected, skipping message creation'));
    return;
  }
  const sections = extractChangelogSections(ast);
  const slackFormat = convertMsgToSlackFormat(sections);
  fs.writeJsonSync(BOT_MESSAGE_JSON, slackFormat);
  console.log(chalk.green('✓ Message successfully created 📜'));
}
