const fs = require("fs");
const config = require("../config.json");

function getService(name) {
	const serviceConfig = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	if (!serviceConfig.hasOwnProperty(name)) return undefined;
	return serviceConfig[name];
}

function updateService(name, status, description) {
	const service = getService(name);
	if (status) service.status = status;
	service.customDescription = description || false;

	const serviceConfig = allServices();
	serviceConfig[name] = service;
	fs.writeFileSync("./services.json", JSON.stringify(serviceConfig, null, 4));
}

function resetService(name) {
	var status = Object.keys(config.statuses).find((status) => config.statuses[status].default);

	updateService(name, status);
}

function reset(name) {
	if (name) return resetService(name);

	// Reset all services if name not specified
	Object.keys(allServices()).forEach((service) => resetService(service));
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
};
