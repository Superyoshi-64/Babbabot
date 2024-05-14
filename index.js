const fs = require('node:fs');
const path = require('node:path');
const discordModals = require('discord-modals');
const { Client, Collection, Intents, MessageAttachment } = require('discord.js');
const { token } = require('./config.json');
const wait = require('node:timers/promises').setTimeout;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
discordModals(client);
const ownerID = '<@580898252602343425>';

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	try {
		if (commandName === 'rule34') {
			await interaction.reply('As of 10:46 PM, May 13, 2024, Isaiah has 28426 Favorites on Rule 34.\nHe\'s added 19 Favorites since the last update.');
		}
		else if (commandName === 'notsorule34') {
			const deleteMessage = interaction.options.getBoolean('delete');
			let rule34Images = ['bob1', 'idontwannaknow1', 'isaiah1', 'isaiah2', 'isaiah3', 'isaiah4', 'isaiah5', 'isaiah6', 'isaiah7', 'isaiah8', 'josiah1', 'ryan1', 'zavier1'];
			rule34Images = rule34Images.map(i => 'images/rule34/' + i);
			rule34Images = rule34Images.map(i => i + '.jpg');
			const random = Math.floor(Math.random() * rule34Images.length);
			const attachment = new MessageAttachment(rule34Images[random]);
			await interaction.reply({ files: [ attachment ] });
			if (deleteMessage !== false) {
				await wait(60000);
				try {
					const testForInteraction = interaction.id
						.then(await interaction.deleteReply(), console.log('The deletion succeded.'));
					if (testForInteraction === 'gone') {
						console.log('how?');
					}
				}
				catch (error) {
					return;
				}
			}
		}
		else if (commandName === 'cat') {
			await interaction.deferReply();
			let catImages = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6', 'cat7', 'cat8', 'cat9', 'cat10', 'cat11', 'cat12', 'cat13', 'cat14', 'cat15', 'cat16', 'cat17', 'cat18', 'cat19', 'cat20', 'cat21', 'cat22', 'cat23', 'cat24', 'cat25', 'cat26', 'cat27', 'cat28', 'cat29', 'cat30', 'cat31', 'notcat1'];
			catImages = catImages.map(i => 'images/cat/' + i);
			catImages = catImages.map(i => i + '.jpg');
			const random = Math.floor(Math.random() * catImages.length);
			const attachment = new MessageAttachment(catImages[random]);
			await interaction.editReply({ files: [ attachment ] });
		}

		else if (commandName === 'fuckyou') {
			const user = interaction.options.getUser('user');
			if (user === client.user) {
				await interaction.reply({ content: 'FUCK YOU I AIN\'T JUST GONNA FUCK MYSELF', ephemeral: true });
				return;
			}
			await interaction.reply({ content: 'it did thing', ephemeral: true });
			await interaction.channel.send(`FUCK YOU ${user}`).then(msg => setTimeout(() => msg.delete(), 600000));
		}
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: `Bot FUCKED UP how dissappointing\n\nAnyways, you probably don't understand this but here's the error:\n\n${error}`, ephemeral: true });
	}
});

client.on('messageCreate', async (message) => {
	if (message.mentions.has(client.user) && message.author !== ownerID) {
		message.channel.send('FUCK OFF');
		console.log(`OH GOD ${message.author.tag} PINGED THE BOT!!!!!`);
	}
});
client.login(token);