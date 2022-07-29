const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Ver el avatar de un usuario')
		.addUserOption(option => option.setName('usuario').setDescription('Ingresa el nombre del usuario del que deseas ver su pfp.')),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario');
		if (user) return interaction.reply(`Avatar de :${user.username} ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL()}`);
	},
};