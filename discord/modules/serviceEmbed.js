const { EmbedBuilder, Embed } = require("discord.js");
const config = require.main.require("./config.json");

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
		.setDescription(toTitleCase(service.status) + " - " + (service.customDescription || statusConfig.description));

	return embed;
}

function all(services) {
	let embeds = [];

	if (config.discord.embedHeader.enabled) {
		embeds.push(
			new EmbedBuilder()
				.setTitle(config.discord.embedHeader.title)
				.setDescription(config.discord.embedHeader.description)
				.setColor(`#${config.discord.embedHeader.color}`)
		);
	}

	Object.keys(services).forEach((id) => {
		var status = services[id];
		embeds.push(embed(status, id));
	});

	return embeds;
}

module.exports = {
	all,
	embed,
};
