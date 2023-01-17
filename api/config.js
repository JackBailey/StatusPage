const services = require("../services/index");
const express = require("express");
const router = express.Router();
const { errorPage } = require("./error");
const config = require.main.require("./config.json");

router.get("*", (req, res) => {
	try {
		const {
			statuses,
			branding,
			discord: { invite, enableGithubIcon: showGithub },
		} = config;
		console.log(invite);
		res.status(200).json({ statuses, branding, invite, showGithub });
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
