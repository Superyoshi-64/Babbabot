const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('rule34').setDescription('See how many Rule 34 favorites Isaiah has.'),
	new SlashCommandBuilder().setName('notsorule34').setDescription('NO NO NO NO NO NO').addBooleanOption(option => option.setName('delete').setDescription('Delete the message a minute after it is sent? Will default to true if unspecified.').setRequired(false)),
	new SlashCommandBuilder().setName('fuckyou').setDescription('FUCK YOU').addUserOption(option => option.setName('user').setDescription('user').setRequired(true)),
	new SlashCommandBuilder().setName('cat').setDescription('Cleanse your eyes after seeing some other stuff.'),
	new SlashCommandBuilder().setName('zoo').setDescription('ZOO'),
	new SlashCommandBuilder().setName('75-25').setDescription('Test your luck and see if you get a good image or a bad image out of the bot\'s entire image library.'),
	new SlashCommandBuilder().setName('sex').setDescription('HUH'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);