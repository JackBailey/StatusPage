const services = require("../services/index");
const express = require("express");
const { errorPage } = require("./error");
const router = express.Router();

router.get("*/:service", (req, res) => {
	try {
		const name = req.params.service;

		var status = services.service.get(name);
		if (!status) return errorPage(req, res, "404");
		res.send(status.status);
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
