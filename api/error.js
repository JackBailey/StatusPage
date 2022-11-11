const path = require("path");

module.exports.errorPage = (req, res, errorCode) => {
	res.render(path.join(__dirname, "/views/error.ejs"), { errorCode });
};
