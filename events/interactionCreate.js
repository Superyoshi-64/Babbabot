module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const now = new Date();
		if (interaction.isCommand()) {
			console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} triggered the command /${interaction.commandName}.`);
		}
		else if (interaction.isButton()) {
			console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} pressed the button ${interaction.customId}.`);
		}
	},
};