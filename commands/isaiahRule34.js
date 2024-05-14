// This command is finished

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('isaiahrule34')
		.setDescription('See how many Rule 34 favorites Isaiah has.'),
	async execute(interaction) {
		await interaction.reply({ content: 'As of 10:04 PM, May 5, 2024, Isaiah has 28027 Favorites on Rule 34. ', ephemeral: true });
	},
};