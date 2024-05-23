module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const now = new Date();
		if (interaction.isCommand()) {
			const { commandName } = interaction;
			if (commandName === 'fuckyou') {
				const user = interaction.options.getUser('user').tag;
				console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} triggered the command /${interaction.commandName} on ${user}.`);
			}
			else {
				console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} triggered the command /${interaction.commandName}.`);
			}
		}
		else if (interaction.isButton()) {
			console.log(`At ${now.toLocaleTimeString()}, ${interaction.user.tag} in #${interaction.channel.name} pressed the button ${interaction.customId}.`);
		}
	},
};