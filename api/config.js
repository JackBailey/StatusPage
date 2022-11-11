const services = require("../services/index");
const express = require("express");
const router = express.Router();
const { errorPage } = require("./error");
const config = require("../config.json");

router.get("*", (req, res) => {
	try {
		const { statuses, branding } = config;
		res.status(200).json({ statuses, branding });
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
