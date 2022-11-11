const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

function embed(title, status, description) {
	var statusConfigs = config.statuses;

	var statusConfig = statusConfigs[status];

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	const embed = new EmbedBuilder()
		.setColor(`#${statusConfig.color}`)
		.setTitle(title)
		.setDescription(toTitleCase(status) + " - " + (description || statusConfig.description));

	return embed;
}

function all(services) {
	let embeds = Object.keys(services).map((id) => {
		var status = services[id];
		return embed(status.title, status.status, status.customDescription);
	});
	return embeds;
}

module.exports = {
	all,
	embed,
};
