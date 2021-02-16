import * as conventionalChangelog from 'conventional-changelog';
import { getPackage } from '../package';
import { getStandardVersionConfig } from '../helpers/getStandardVersionConfig';
import * as presetLoader from 'standard-version/lib/preset-loader';
import { parse as mdToAST } from '@textlint/markdown-to-ast';
import { ASTNode } from '../types';

export function getChangelogAST(): Promise<ASTNode> {
  return new Promise((resolve, reject) => {
    let markdown = '';
    const versionrc = getStandardVersionConfig();
    const tagPrefix = versionrc['tag-prefix'] || 'v';

    conventionalChangelog(
      { preset: presetLoader(versionrc), tagPrefix },
      { version: getPackage().version },
      { merges: null }
    )
      .on('error', reject)
      .on('data', buffer => (markdown += buffer.toString()))
      .on('end', () => resolve(mdToAST(markdown)));
  });
}
