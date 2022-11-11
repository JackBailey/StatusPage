const services = require("../../services/index");
const express = require("express");
const router = express.Router();
const { errorPage } = require("../error");

var legacyMap = {
	windows: "win",
	macos: "macos",
	ios: "ios",
	roware: "roware",
	website: "web",
};

router.get("*", (req, res) => {
	try {
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
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
