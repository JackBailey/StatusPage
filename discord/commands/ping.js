const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const humanizeDuration = require("humanize-duration");
const config = require("../../config.json");
const started = new Date().getTime();

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with the bot's latency in ms!"),
	async execute(interaction) {
		var initialEmbed = new EmbedBuilder().setTitle("Pinging...");

		function humanize(value) {
			var humanized = humanizeDuration(value, {
				round: true,
				units: ["y", "mo", "w", "d", "h", "m", "s", "ms"],
			});
			return humanized.replaceAll("milliseconds", "ms");
		}

		const message = await interaction.reply({ embeds: [initialEmbed], fetchReply: true });
		const botLatency = humanize(message.createdTimestamp - interaction.createdTimestamp);
		const uptime = new Date().getTime() - started;
		const uptimeDuration = humanize(uptime);
		const discordLatency = humanize(client.ws.ping);

		var finalEmbed = new EmbedBuilder()
			.setColor("#3AA55D")
			.addFields(
				{
					name: "Bot Latency",
					value: `\`${botLatency}\``,
					inline: true,
				},
				{
					name: "Discord Latency",
					value: `\`${discordLatency}\``,
					inline: true,
				},
				{
					name: "Uptime",
					value: `\`${uptimeDuration}\``,
					inline: true,
				}
			)
			.setFooter({ text: config.branding.url });

		await interaction.editReply({ embeds: [finalEmbed] });
	},
};
