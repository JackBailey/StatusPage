const fs = require("fs");
const config = require("../config.json");
const { log } = require("./log");
const statusEmbed = require("../discord/modules/statusEmbed");
const serviceEmbed = require("../discord/modules/serviceEmbed");

function getService(name) {
	const serviceConfig = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	if (!serviceConfig.hasOwnProperty(name)) return undefined;
	return serviceConfig[name];
}

function updateService(name, status, description, user) {
	const service = getService(name);
	if (status) service.status = status;
	service.customDescription = description || false;

	const serviceConfig = allServices();
	serviceConfig[name] = service;
	fs.writeFileSync("./services.json", JSON.stringify(serviceConfig, null, 4));

	var logDescription = `Status for \`${name}\` has been set to \`${service.status}\``;

	if (description) {
		logDescription += ` with the description \`${description}\``;
	}

	updateEmbed();

	// Don't log if invoked via script
	if (!user) return;

	log({
		user: user,
		title: "Updated status",
		description: logDescription,
		color: config.statuses[service.status].color,
	});
}

function updateEmbed() {
	statusEmbed.update(serviceEmbed.all(allServices()));
}

function reset(name, user) {
	var defaultStatus = Object.keys(config.statuses).find((status) => config.statuses[status].default);

	if (name) {
		log({
			user: user,
			title: "Reset status",
			description: `Status for \`${name}\` has been reset to \`${defaultStatus}\``,
			color: config.statuses[defaultStatus].color,
		});
		return updateService(name, defaultStatus);
	}

	// Reset all services if name not specified

	log({
		user: user,
		title: "Reset status",
		description: `Status for All Services have been reset to \`${defaultStatus}\``,
		color: config.statuses[defaultStatus].color,
	});
	Object.keys(allServices()).forEach((service) => updateService(service, defaultStatus));
}

function allServices() {
	const serviceConfig = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	return serviceConfig;
}

module.exports = {
	service: {
		get: getService,
		update: updateService,
	},
	all: allServices,
	reset,
	updateEmbed,
};
