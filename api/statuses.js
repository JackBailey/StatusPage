const services = require("../services/index");
const express = require("express");
const router = express.Router();
const { errorPage } = require("./error");

router.get("*", (req, res) => {
	try {
		res.status(200).json(services.all());
	} catch (e) {
		console.log(e);
		return errorPage(req, res, 500);
	}
});

module.exports = router;
