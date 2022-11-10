const fs = require("fs");

function getService(name) {
	const services = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	if (!services.hasOwnProperty(name)) return undefined;
	return services[name];
}

function updateService(name, status, description) {
	const service = getService(name);
	if (status) service.status = status;
	service.customDescription = description || false;

	const services = listServices();
	services[name] = service;
	fs.writeFileSync("./services.json", JSON.stringify(services, null, 4));
}

function listServices() {
	const services = JSON.parse(fs.readFileSync("./services.json", "utf8"));
	return services;
}

module.exports = {
	service: {
		get: getService,
		update: updateService,
	},
	list: listServices,
};
