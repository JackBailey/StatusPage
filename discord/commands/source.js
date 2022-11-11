const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("source").setDescription("Replies with the source code for StatusPage!"),
	async execute(interaction) {
		await interaction.reply({ content: `https://github.com/JackBailey/StatusPage` });
	},
};
