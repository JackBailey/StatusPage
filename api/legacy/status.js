const services = require("../../services/index");
const express = require("express");
const { errorPage } = require("../error");
const router = express.Router();

var legacyMap = {
	windows: "win",
	macos: "macos",
	ios: "ios",
	roware: "roware",
	website: "web",
};

router.get("*/:service", (req, res) => {
	try {
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
		if (!status) return errorPage(req, res, "404");
		res.send(status.status);
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
