export const optionDefinitions = [
    {name: 'package', alias: 'p', type: String, description: 'Path to your package.json file'},
    {name: 'help', alias: 'h', type: Boolean, description: 'Help me, please!'}
];

export const sections = [
    {
        header: 'Slack Version Bot 🤖',
        content: 'Integrate a slack bot with standard-release version management'
    },
    {
        header: 'Actions',
        content: ['$ version-bot init', '$ version-bot build-message', '$ version-bot post-message']
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    }
];
