const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

module.exports.embed = (title, status, description) => {
	var statusConfigs = config.statuses;

	var statusConfig = statusConfigs[status];

	const embed = new EmbedBuilder()
		.setColor(`#${statusConfig.color}`)
		.setTitle(title)
		.setDescription(description || statusConfig.description);

	return embed;
};
