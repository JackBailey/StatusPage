const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports.log = async ({ user, title, description, color }) => {
	const logChannelID = config.discord.logChannel.id;
	const logChannel = await client.channels.fetch(logChannelID);

	const avatar = user.avatar
		? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=32`
		: "https://discord.com/assets/3c6ccb83716d1e4fb91d3082f6b21d77.png";

	const embed = new EmbedBuilder()
		.setColor(`#${color}`)
		.setTitle(title)
		.setDescription(description)
		.setAuthor({
			name: `${user.username}#${user.discriminator}`,
			iconURL: avatar,
		});

	await logChannel.send({ embeds: [embed] });
};
