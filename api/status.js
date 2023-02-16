const services = require("../services/index");
const express = require("express");
const config = require("../config.json");
const { errorPage } = require("./error");
const { makeBadge } = require("badge-maker");

const router = express.Router();

router.get("/api/status/:service", (req, res) => {
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

router.get("/api/status/:service/badge", (req, res) => {
	try {
		const name = req.params.service;
		const altLabel = req.query.label;

		var status = services.service.get(name);
		if (!status) return errorPage(req, res, "404");

		const format = {
			label: altLabel || status.title,
			message: status.status,
			color: config.statuses[status.status].color,
		};

		const svg = makeBadge(format);

		res.writeHead(200, {
			"Content-Type": "image/svg+xml",
			"Content-Length": svg.length,
		});

		res.end(svg);
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
