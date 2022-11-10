const fs = require("fs");

function getService(name) {
	const serviceConfig = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	if (!serviceConfig.hasOwnProperty(name)) return undefined;
	return serviceConfig[name];
}

function updateService(name, status, description) {
	const service = getService(name);
	if (status) service.status = status;
	service.customDescription = description || false;

	const serviceConfig = listServices();
	serviceConfig[name] = service;
	fs.writeFileSync("./services.json", JSON.stringify(serviceConfig, null, 4));
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
};
