const fs = require('node:fs');
const path = require('node:path');
const fetch = (...args) =>
	import('node-fetch').then(({
		default: fetch
	}) => fetch(...args));


const {
	Client,
	Collection,
	GatewayIntentBits
} = require('discord.js');
require('dotenv').config();


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

client.login(process.env.token);

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	try {
		if (message.content.toLowerCase().startsWith('-quiz')) {
			const response = await fetch('https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=boolean');
			const data = await response.json();
			var length = data.results.length;
			var randomNumber = Math.floor(Math.random() * length);
			var randomQuestion = data.results[randomNumber];
			var question = randomQuestion.question;
			var correctAnswer = randomQuestion.correct_answer;
			message.channel.send(question);
			const filter = m => m.author.id === message.author.id;
			const answer = await message.channel.awaitMessages({
				filter: filter,
				max: 1
			});
			/* await message.channel.awaitMessages(filter, {
				maxMatches: 1,
				time: 10000,
				errors: ['time', 'maxMatches']
			}); */
			const ans = answer.first();
			if (ans.content.toLowerCase() === correctAnswer.toLowerCase()) {
				message.channel.send("Respuesta correcta")
			} else {
				message.channel.send("Incorrecto")
			}
		}
	} catch (e) {
		return e;
	}
})