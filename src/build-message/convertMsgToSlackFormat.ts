import { ASTNode, SectionItem, Sections, SlackSectionBlock } from '../types';
import { getHeaderMessage } from './getHeaderMessage';
import { getFooterMessage } from './getFooterMessage';

const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

function createSectionBlock(text: string): SlackSectionBlock {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text
    }
  };
}

function convertToSlackLink(linkNode: ASTNode): string {
  const { url } = linkNode;
  const display = linkNode.children[0].value;

  return `<${url}|${display}>`;
}

function formatSectionItemToString(item: SectionItem, emoji: string) {
  let title = `• ${item.title}`;
  if (emoji) {
    title = title.replace(emoji, '');
  }
  const commit = convertToSlackLink(item.commitLink);
  const issue = item.issueLink ? ` closes ${convertToSlackLink(item.issueLink)}` : '';

  return `${title}${commit})${issue}`;
}

function extractEmojiFromItem(item: SectionItem) {
  const [emoji] = item.title.match(emojiRegex) || [''];

  return emoji;
}

function getSectionMessage(title: string, items: SectionItem[]) {
  const sectionEmoji = extractEmojiFromItem(items[0]);
  const itemsAsSlackList = items.map(i => formatSectionItemToString(i, sectionEmoji)).join('\n');

  return `*${sectionEmoji} ${title}*:\n${itemsAsSlackList}`;
}

export function convertMsgToSlackFormat(sections: Sections): SlackSectionBlock[] {
  const header = createSectionBlock(getHeaderMessage());
  const messageBlocks = [header];
  for (const [title, items] of Object.entries(sections)) {
    const sectionBlock = createSectionBlock(getSectionMessage(title, items));
    messageBlocks.push(sectionBlock);
  }
  const footer = createSectionBlock(getFooterMessage());
  messageBlocks.push(footer);

  return messageBlocks;
}
