const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

function embed(service, id) {
	var statusConfigs = config.statuses;

	var statusConfig = statusConfigs[service.status];

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	const embed = new EmbedBuilder()
		.setColor(`#${statusConfig.color}`)
		.setTitle(service.title)
		.setURL(`${config.branding.url}/?service=${id}`)
		.setDescription(toTitleCase(service.status) + " - " + (service.description || statusConfig.description));

	return embed;
}

function all(services) {
	let embeds = Object.keys(services).map((id) => {
		var status = services[id];
		return embed(status, id);
	});
	return embeds;
}

module.exports = {
	all,
	embed,
};
