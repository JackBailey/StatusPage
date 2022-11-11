const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with the bot's latency in ms!"),
	async execute(interaction) {
		const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
		var duration = sent.createdTimestamp - interaction.createdTimestamp;
		await interaction.editReply({ content: `${duration}ms` });
	},
};
