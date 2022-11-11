const discord = require("./discord");
const express = require("express");
const services = require("./services/index");

const app = express();

discord.init();

var legacyMap = {
	windows: "win",
	macos: "macos",
	ios: "ios",
	roware: "roware",
	website: "web",
};

app.get("/api/statuses", (req, res) => {
	res.status(200).json(services.all());
});

app.get("/status", (req, res) => {
	var statuses = services.all();

	var legacyResponse = {};
	Object.keys(legacyMap).map((name) => {
		var service = statuses[name];

		legacyResponse[legacyMap[name]] = {
			customStatus: service.customDescription ? service.customDescription : null,
			statusType: service.status,
			name: service.title,
		};
	});

	res.status(200).json(legacyResponse);
});

app.get("/status/:service", (req, res) => {
	const name = req.params.service;

	function swap(json) {
		var ret = {};
		for (var key in json) {
			ret[json[key]] = key;
		}
		return ret;
	}

	var legacyToModern = swap(legacyMap);

	var status = services.service.get(legacyToModern[name]);

	res.send(status.status);
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Listening on port ${process.env.PORT || 3000}`);
});
