module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		const now = new Date();
		console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} triggered the command /${interaction.commandName}.`);
	},
};