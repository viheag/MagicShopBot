const {
	SlashCommandBuilder,
	EmbedBuilder
} = require('discord.js');
const fetch = (...args) =>
	import('node-fetch').then(({
		default: fetch
	}) => fetch(...args));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription('Start a quiz with 10 answers'),

	async execute(interaction) {
		await game(interaction);
	}
}

async function game(interaction){
	const response = await fetch('https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=boolean');
		const data = await response.json();
		var length = data.results.length;
		var randomNumber = Math.floor(Math.random() * length);
		var randomQuestion = data.results[randomNumber];
		var question = randomQuestion.question;
		var correctAnswer = randomQuestion.correct_answer;
		var question_embed = new EmbedBuilder()
			.setColor('#9F75C9')
			.setTitle(question)
			.setDescription(['perro\n','gato\n'].join('\n'))
			.setFooter({
				text: "test"
			})
			.setTimestamp(); 
		var message = await interaction.reply({
			embeds: [question_embed],
			fetchReply: true
		});
		message.react('👍').then(() => message.react('👎'));

		const filter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
		};
		 
		message.awaitReactions({
				filter,
				max: 1,
				time: 60000,
				errors: ['time']
			})
			.then(collected => {
				const reaction = collected.first();

				if (reaction.emoji.name === '👍') {
					message.reply('You reacted with a thumbs up.');
				} else {
					message.reply('You reacted with a thumbs down.');
				}
			})
			.catch(collected => {
				message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
			});
}