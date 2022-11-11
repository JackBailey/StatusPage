const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports.userAuthorized = (interaction) => {
	var { authorizedRoles } = config.discord;
	const authorized = interaction.member.roles.cache.some((role) => authorizedRoles.includes(role.id));
	if (!authorized) {
		var embed = new EmbedBuilder()
			.setColor("#ED4145")
			.setTitle("Invalid Permissions")
			.setDescription("You are not authorized to perform this command.")
			.setImage("https://http.cat/403");
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
	return authorized;
};
