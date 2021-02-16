import { ASTNode, Sections } from '../types';
import { getSectionItems } from './getSectionItems';
import { addParamValue } from '../helpers/transpileString';

function getSectionTitle(node: ASTNode) {
  return node.children[0].value;
}

export function extractChangelogSections(ast: ASTNode): Sections {
  /* For example https://github.com/shaharkazaz/version-bot/compare/v1.0.0...v2.0.0 */
  const documentItems = ast.children;
  const versionHeaderNode = documentItems[0].children[0];
  addParamValue({
    compareChangesLink: versionHeaderNode.url,
    version: versionHeaderNode.children[0].value
  });

  const sections: Sections = {};
  /* We start from 1 in order to skip the version header */
  for (let i = 1; i < documentItems.length; i++) {
    const headerNode = documentItems[i];
    const sectionTitle = getSectionTitle(headerNode);
    i++;
    const sectionListNode = documentItems[i];
    sections[sectionTitle] = getSectionItems(sectionListNode);
  }

  return sections;
}
