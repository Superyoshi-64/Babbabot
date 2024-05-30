// Define the required dependencies.
const fs = require('node:fs');
const path = require('node:path');
const discordModals = require('discord-modals');
const { Client, Intents, MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const wait = require('node:timers/promises').setTimeout;
let sexCommandInteractionUser;

// Define the actual client/bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });

// This will probably be used eventually, I just don't know when.
discordModals(client);

// Event code block, these are only for printing things to the console.
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


// Array definitions block, defines all the pictures used in the commands.
let catImages = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6', 'cat7', 'cat8', 'cat9', 'cat10', 'cat11', 'cat12', 'cat13', 'cat14', 'cat15', 'cat16', 'cat17', 'cat18', 'cat19', 'cat20', 'cat21', 'cat22', 'cat23', 'cat24', 'cat25', 'cat26', 'cat27', 'cat28', 'cat29', 'cat30', 'cat31', 'notcat1'];
catImages = catImages.map(i => 'images/cat/' + i + '.jpg');
let rule34Images = ['bob1', 'group1', 'idontwannaknow1', 'isaiah1', 'isaiah2', 'isaiah3', 'isaiah4', 'isaiah5', 'isaiah6', 'isaiah7', 'isaiah8', 'josiah1', 'ryan1', 'zavier1'];
rule34Images = rule34Images.map(i => 'images/rule34/' + i + '.jpg');
let zooImages = ['zoo1', 'zoo2', 'zoo3', 'zoo4', 'zoo5', 'zoo6', 'zoo7', 'zoo8', 'zoo9', 'zoo10', 'zoo11', 'zoo12', 'zoo13', 'zoo14', 'zoo15', 'zoo16', 'zoo17', 'zoo18', 'zoo19', 'zoo20', 'zoo21'];
zooImages = zooImages.map(i => 'images/zoo/' + i + '.jpg');
const allImages = catImages.concat(rule34Images, zooImages);


// THE COMMAND AND BUTTON BLOCK
client.on('interactionCreate', async interaction => {
	// if (interaction.user.id != '580898252602343425' && '708437777901027360') {
	// 	await interaction.reply('The bot is currently in testing mode. You are not able to interact with it right now.');
	// 	return;
	// }
	if (interaction.isCommand()) {
		const { commandName } = interaction;
		try {
			// Command that shows Isaiah's rule 34 favorites.
			if (commandName === 'rule34') {
				await interaction.reply('# As of 13:32, May 30, 2024, Isaiah has 29725 Favorites on Rule 34.\n # He\'s gained 2 Favorites since the last update.');
			}

			// The... porn command...
			else if (commandName === 'notsorule34') {
				const deleteMessage = interaction.options.getBoolean('delete');
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

			// Cat pictures command
			else if (commandName === 'cat') {
				await interaction.deferReply();
				const random = Math.floor(Math.random() * catImages.length);
				const attachment = new MessageAttachment(catImages[random]);
				await interaction.editReply({ files: [ attachment ] });
			}

			// Zoo pictures command
			else if (commandName === 'zoo') {
				await interaction.deferReply();
				const random = Math.floor(Math.random() * zooImages.length);
				const attachment = new MessageAttachment(zooImages[random]);
				await interaction.editReply({ files: [ attachment ] });
			}

			// All images command. The name of this may change depending on the normal image to porn image ratio.
			else if (commandName === '74-26') {
				await interaction.deferReply();
				const random = Math.floor(Math.random() * allImages.length);
				const attachment = new MessageAttachment(allImages[random]);
				await interaction.editReply({ files: [ attachment ] });
			}

			// The command that sends the ANONYMOUS fuck you message.
			else if (commandName === 'fuckyou') {
				const user = interaction.options.getUser('user');
				if (user === client.user) {
					await interaction.reply({ content: 'FUCK YOU I AIN\'T JUST GONNA FUCK MYSELF', ephemeral: true });
					return;
				}
				await interaction.reply({ content: 'it did thing', ephemeral: true });
				await interaction.channel.send(`FUCK YOU ${user}`);
			}

			// The strange sex command
			else if (commandName === 'sex') {
				sexCommandInteractionUser = interaction.user.id;
				const buttonRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('confirm_sex')
							.setLabel('Yes')
							.setStyle('DANGER'),
						new MessageButton()
							.setCustomId('decline_sex')
							.setLabel('No')
							.setStyle('SECONDARY'),
					);
				await interaction.reply({ content: 'Are you sure you want to sex the bot?', components: [buttonRow] });
				// Start a collector to disable buttons once clicked
				const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
				collector.on('collect', i => {
					if (i.user.id === interaction.user.id) {
						buttonRow.components[0].setDisabled(true);
						buttonRow.components[1].setDisabled(true);
						interaction.editReply({ content: 'Are you sure you want to sex the bot?', components: [buttonRow] });
					}
					else {
						i.channel.send(`Fuck off ${i.user} these aren't your buttons.`);
					}
				});
				collector.on('end', collected => {
					if (collected.size > 0) return;
					buttonRow.components[0].setDisabled(true);
					buttonRow.components[1].setDisabled(true);
					interaction.editReply({ content: 'Are you sure you want to sex the bot?', components: [buttonRow] });
					interaction.followUp({ content: 'You ran out of time to respond.', ephemeral: true });
				});
			}
		}
		// Catch an error and tell the user and console the error.
		catch (error) {
			console.error(error);
			await interaction.reply({ content: `Bot FUCKED UP how dissappointing\n\nAnyways, you probably don't understand this but here's the error:\n\n${error}`, ephemeral: true });
		}
	}
	else if (interaction.isButton()) {
		try {
			// First Confirm Sex Button
			if (interaction.customId === 'confirm_sex') {
				if (interaction.user.id != sexCommandInteractionUser) return;
				await interaction.channel.send('...');
				const buttonRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('second_confirm_sex')
							.setLabel('Yes')
							.setStyle('DANGER'),
						new MessageButton()
							.setCustomId('second_decline_sex')
							.setLabel('No')
							.setStyle('SUCCESS'),
					);
				await wait(1500);
				await interaction.reply({ content: 'ARE YOU REALLY SURE YOU WANT TO SEX THE BOT?', components: [buttonRow] });
				// Start a collector to disable buttons once clicked
				const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
				collector.on('collect', i => {
					if (i.user.id === interaction.user.id) {
						buttonRow.components[0].setDisabled(true);
						buttonRow.components[1].setDisabled(true);
						interaction.editReply({ content: 'ARE YOU REALLY SURE YOU WANT TO SEX THE BOT?', components: [buttonRow] });
					}
					else {
						i.channel.send(`Fuck off ${i.user} these aren't your buttons.`);
					}
				});
				collector.on('end', collected => {
					if (collected.size > 0) return;
					buttonRow.components[0].setDisabled(true);
					buttonRow.components[1].setDisabled(true);
					interaction.editReply({ content: 'Are you sure you want to sex the bot?', components: [buttonRow] });
					interaction.followUp({ content: 'You ran out of time to respond.', ephemeral: true });
				});
			}
			// First Decline Sex Button
			else if (interaction.customId === 'decline_sex') {
				if (interaction.user.id != sexCommandInteractionUser) return;
				await interaction.reply('You did not sex the bot.');
			}
			// Second Confirm Sex Button
			else if (interaction.customId === 'second_confirm_sex') {
				if (interaction.user.id != sexCommandInteractionUser) return;
				await interaction.reply('You are currently having sex... Please wait...');
				const userEnjoyment = Math.round(Math.random() * 100);
				const botEnjoyment = Math.round(Math.random() * 100);
				const sexEmbed = new MessageEmbed()
					.setColor(0xAAE5A4)
					.setTitle('Sex')
					.addFields(
						{ name: 'Your Enjoyment:', value: `${userEnjoyment}%` },
						{ name: 'Their Enjoyment', value: `${botEnjoyment}%` },
					)
					.setFooter({ text: 'Totally not just based on BitLife.' });
				await wait(10000);
				await interaction.followUp({ content: '# You finished having sex', embeds: [sexEmbed] });
			}
			// Second Decline Sex Button
			else if (interaction.customId === 'second_decline_sex') {
				if (interaction.user.id != sexCommandInteractionUser) return;
				await interaction.reply('You did not sex the bot');
			}
		}
		// Catch an error and tell the user and console the error.
		catch (error) {
			console.error(error);
			await interaction.reply({ content: `Bot FUCKED UP how dissappointing\n\nAnyways, you probably don't understand this but here's the error:\n\n${error}`, ephemeral: true });
		}
	}
});


// Detect if a sent message mentions the bot so it can tell them to fuck off.
client.on('messageCreate', async (message) => {
	if (message.mentions.has(client.user)) {
		message.channel.send('FUCK OFF');
		console.log(`OH GOD ${message.author.tag} PINGED THE BOT!!!!!`);
	}
});

// Login
client.login(token);