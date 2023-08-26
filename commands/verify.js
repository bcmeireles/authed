const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Run this command to get verified.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Click here')
			.setDescription('Click the link above to verify your account.')
			.setURL(config.base_url)
			.setFooter({text:'verification', iconURL:'https://i.imgur.com/4ZQZ9ZS.png'});
		
		await interaction.reply({ embeds: [embed] });
	},
};