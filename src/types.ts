export type HashMap<T = any> = { [key: string]: T };

export const BOT_MESSAGE_JSON = '.version-bot-message.json';

export type ASTNode = {
  type: 'Document' | 'Header' | 'Link' | 'ListItem' | 'Str' | 'Paragraph' | 'Strong' | 'Text';
  children: ASTNode[];
  raw: string;
  loc: { start: number; end: number };
  range: [number, number];
  value?: string;
  link?: string;
  url?: string;
};

export type SectionItem = { title: string; commitLink: ASTNode; issueLink?: ASTNode };

export type Sections = HashMap<SectionItem[]>;

export type SlackSectionBlock = {
  type: 'section';
  text: {
    type: 'mrkdwn';
    text: string;
  };
};

export type Config = {
  webHookLink?: string;
  headerMessages?: string[];
  footerMessage?: string;
  notify?: ('channel' | 'here') | ('channel' | 'here')[];
};
export type ConfigOrigin = 'package.json' | '.versionrc.json' | '.versionrc.js';
